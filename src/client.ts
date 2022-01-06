import { createConnection, Socket } from "net";
import { connect, TLSSocket } from "tls";
import { v4 as uuidv4} from "uuid";

import { IRedisClientPool } from "./pool";
import redisCommands from "./commands";
import protocol, { RedisError, RespContentType, RespResponse } from "./protocol";  

export interface IRedisClientOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  timeout?: number;
  tls?: {
    key: Buffer;
    cert: Buffer;
  };
}
type ObjFieldValue = string | number | Date;

export type ObjInRedis = {
  [key: string]: ObjFieldValue;
}

export interface IRedisClient {
  id: string;

  // setPool(pool: IRedisClientPool): void;

  on(event: "error", listener: (err: Error) => void): void;
  on(event: "close", listener: (hadError: boolean) => void): void;
  on(event: "end", listener: () => void): void;
  on(event: "timeout", listener: () => void): void;
  on(event: "ready", listener: () => void): void;

  close(): void;

  rawCommand(...cmds: Array<string | number>): Promise<Array<RespResponse>>;

  // Delete
  delete(key: string): Promise<void>;

  // Counter commands
  incr(counter: string): Promise<number>;
  decr(counter: string): Promise<number>;
  setCounter(counterName: string): Promise<number>;
  getCounter(counterName: string): Promise<number>;
  
  // Hash(Object) functions
  setObject(key: string, value: ObjInRedis): Promise<void>;
  getObject(key: string): Promise<ObjInRedis>;
  setHashField(key: string, field: string, value: ObjFieldValue): Promise<void>;
  getHashField(key: string, field: string): Promise<ObjFieldValue>;

  // Ordinary use
  get(key: string): Promise<string>;
  set(key: string): Promise<void>;
  mget(...keys: string[]): Promise<string[]>;
  mset(keys?: string[], values?: string[]): Promise<void>;
  mset(...keyValPairs: string[]): Promise<void>;

  hasKey(keyPattern: string): Promise<boolean>;
  keyExists(keys: string[]): Promise<boolean>;
}

const CONN_TIMEOUT: number = 30000;
const CMD_TIMEOUT: number = 10000;

export class RedisClient implements IRedisClient{
  static states = {
    CREATED: "created",
    READY: "ready",
    ERRORED: "errored",
    TIMEOUT: "timeout",
    DESTROYED: "destroyed",
    UNABLE_TO_AUTH: "unable_to_auth",
  }
  public id: string;
  public state: string;

  private socket: Socket;
  private options: IRedisClientOptions;
  private inPool: boolean = false;

  private onError?: (err: Error) => void;
  private onClose?: (hadError: boolean) => void;
  private onEnd?: () => void;
  private onTimeout?: () => void;
  private onReady?: () => void;
  private onAuthFailed?: () => void;

  // private pool?: IRedisClientPool;

  private cmdCallback?: (parsedData: Array<RespResponse>) => void;

  constructor(options?: IRedisClientOptions, inPool?: boolean) {
    this.id = uuidv4();
    this.options = {};
    this.options.host = options?.host || '127.0.0.1';
    this.options.port = options?.port || 6379;
    this.options.username = options?.username;
    this.options.password = options?.password;
    this.options.timeout = options?.timeout || 5000;
    this.options.tls = options?.tls;
    this.inPool = inPool ?? false;

    if (this.options.tls) {
      this.socket = connect({
        host: this.options.host,
        port: this.options.port,
        key: this.options.tls.key,
        cert: this.options.tls.cert,
      });
    } else {
      this.socket = createConnection({
        host: this.options.host,
        port: this.options.port,
      })
    }

    this.state = RedisClient.states.CREATED;

    this.socket.on("error", () => {
      this.goToError("Socket Error happened!");   
    })
    
    this.socket.on('connect', async () => {
      // Init socket after socket connection successfully established.
      this.socketInit();
      // Auth is required

      // Issue the first PING Command
      await this.rawCommand(...redisCommands.connection.PING)
        .then(answer => {
          if (answer.length === 1 && answer[0].content === "PONG") {
            this.getReady();
          } else if (answer.length === 1 &&
            answer[0].contentType === "error" &&
            (answer[0].content as RedisError).tag.toLowerCase() === "noauth") {
              if (this.options.password) {
                const auth = this.options.username
                  ? [this.options.username, this.options.password]
                  : [this.options.password];
                return this.rawCommand(...redisCommands.connection.AUTH, ...auth);
              } else {
                this.state = RedisClient.states.UNABLE_TO_AUTH;
                if (this.onAuthFailed && typeof this.onAuthFailed === "function") {
                  this.onAuthFailed();
                }
              }
          } else {
            this.goToError("Basic Communication test failed!");
          }
        })
        .then(authResult => {
          if (authResult) {
            if (authResult.length === 1 && authResult[0].content === "OK") {
              this.getReady();
            } else {
              this.goToError("AUTH failed, please check the username and password!")
            }
          }
        })
        .catch(err => {
          // This Exception is timeout for a command.
          this.goToError("Basic Communication test failed!");
        });
    });
  }

  public close(): void {
    this.socket.end();
    this.socket.destroy();
    this.state = RedisClient.states.DESTROYED;
  }

  // public setPool(pool: IRedisClientPool): void {
  //   this.pool = pool;
  // }

  public on(event: "error", listener: (err: Error) => void): void;
  public on(event: "close", listener: (hadError: boolean) => void): void;
  public on(event: "end", listener: () => void): void;
  public on(event: "timeout", listener: () => void): void;
  public on(event: "ready", listener: () => void): void;
  public on(event: string, listener: (...args: any[]) => void): void {
    switch(event) {
      case "error":
        this.onError = listener;
        break;
      case "close":
        this.onClose = listener;
        break;
      case "end":
        this.onEnd = listener;
        break;
      case "timeout":
        this.onTimeout = listener;
        break;
      case "ready":
        this.onReady = listener;
        break;
      default:
        console.error("Event not defined for this redis client!");
    }
  }

  public rawCommand(...cmds: (string | number)[]): Promise<RespResponse[]> {
    return new Promise((resolve, reject) => {
      const cmdOut = protocol.encode(cmds);
      this.socket.write(cmdOut);
      // Setup timeout setting 
      const timeoutId = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command timeout occured after ${CMD_TIMEOUT / 1000} seconds.`)
      }, CMD_TIMEOUT);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        clearTimeout(timeoutId);
        resolve(data);
      }
    });
  }

  public commands(cmds: (string | number)[][]): Promise<RespResponse[]> {
    return new Promise((resolve, reject) => {
      const cmdOut = cmds.map(cmd => protocol.encode(cmd)).join("");
      this.socket.write(cmdOut);
      // Setup timeout setting 
      const timeoutId = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command timeout occured after ${CMD_TIMEOUT / 1000} seconds.`)
      }, CMD_TIMEOUT);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        clearTimeout(timeoutId);
        resolve(data);
      }
    });
  }

  /**
   * The abstracted quick commands
   */
  
  /**
   * Delete one key
   * @param key The key required to disappear.
   * @returns 
   */
  public delete(key: string): Promise<void> {
    return this.rawCommand(...redisCommands.generic.DEL, key)
      .then(answer => {
        if (answer.length > 0 && answer[0].contentType === "integer") {
          if (answer[0].content as number > 0) {
            return Promise.resolve();
          }
          else {
            return Promise.reject("No key deleted!");
          }
        } else {
          return Promise.reject("Key deleting failed!");
        }
      });
  }

  /**
   * To increment one counter.
   * @param counter The counter that will be incremented.
   * @returns The new value after incremention
   */
  public incr(counter: string): Promise<number> {
    return this.rawCommand(...redisCommands.string.INCR, counter)
      .then(answer => {
        if (answer.length > 0 && answer[0].contentType === "integer") {
          return Promise.resolve(answer[0].content as number);
        } else {
          return Promise.reject("Incr failed!");
        }
      });
  }
  
  /**
   * To decrement one counter.
   * @param counter The counter that will be decremented.
   * @returns The new value after decremention
   */
  public decr(counter: string): Promise<number> {
    return this.rawCommand(...redisCommands.string.DECR, counter)
      .then(answer => {
        if (answer.length > 0 && answer[0].contentType === "integer") {
          return Promise.resolve(answer[0].content as number);
        } else {
          return Promise.reject("Decr failed!");
        }
      });
  }

  public setCounter(counterName: string): Promise<number> {
    //TODO: implement it later.
    return Promise.resolve(0);
  }

  public getCounter(counterName: string): Promise<number> {
    return this.rawCommand(...redisCommands.string.GET, counterName)
      .then(answer => {
        if (answer.length > 0) {
          try {
            return Promise.resolve(parseInt(answer[0].content as string));  
          } catch (error) {
            return Promise.reject(`${counterName} might be not a counter!`);
          }
        } else {
          return Promise.reject(`${counterName} might be not a counter!`);
        }
      });
  }

  public setObject(key: string, value: ObjInRedis): Promise<void> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public getObject(key: string): Promise<ObjInRedis> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public setHashField(key: string, field: string, value: ObjFieldValue): Promise<void> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public getHashField(key: string, field: string): Promise<ObjFieldValue> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public get(key: string): Promise<string> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public set(key: string): Promise<void> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public mget(...keys: string[]): Promise<string[]> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public mset(keys?: string[], values?: string[]): Promise<void>;
  public mset(...keyValPairs: string[]): Promise<void>;
  public mset(keys?: any, values?: any, ...rest: any[]): Promise<void> {
    // TODO: implement it later
    return Promise.reject("not implemented yet!");
  }

  public hasKey(keyPattern: string) {
    return this.rawCommand(...redisCommands.generic.KEYS, keyPattern)
      .then(answer => {
        if (answer.length  === 1 && answer[0].contentType === "array") {
          return Promise.resolve((answer[0].content as Array<RespResponse>).length > 0);
        } else {
          return Promise.reject(`Commmand failed!`);
        }
      })
  }

  public keyExists(keys: string[]): Promise<boolean> {
    return this.rawCommand(...redisCommands.generic.EXISTS, ...keys)
      .then(answer => {
        if (answer.length  === 1) {
          return Promise.resolve((answer[0].content as number) === keys.length);
        } else {
          return Promise.reject(`Commmand failed!`);
        }
      })
  }

  /**
   * -----------------------------------   Private methods -------------------------------------------------------------------
   */

  private getReady(): void {
    this.state = RedisClient.states.READY;
    // Handle OnReady events.
    if (this.onReady && typeof this.onReady === 'function') {
      this.onReady();
    }
  }

  private goToError(msg: string): void {
    this.state = RedisClient.states.ERRORED;
    // Close the socket when errored
    this.close();
    // console.error("Client on ERROR!");
    // Feed error to the outer user
    if (this.onError && typeof this.onError === "function") {
      // console.log("SOCKET ERROR emited to outer module.")
      this.onError(new Error(msg));
    } 
  }

  private socketInit(): void {
    
    this.socket.on("end", () => {
      if (this.onEnd && typeof this.onEnd === 'function') {
        this.onEnd();
      }
    })

    this.socket.on("close", (hadError: boolean) => {
      if (this.onClose && typeof this.onClose === 'function') {
        this.onClose(hadError);
      }
    })

    if (this.inPool) {
      this.socket.setTimeout(CONN_TIMEOUT);
      this.socket.on("timeout", () => {
        // Handle the callback set by outer module first
        if (this.onTimeout && typeof this.onTimeout === 'function') {
          this.onTimeout();
        }
      })
    }

    this.socket.on("data", (data: Buffer) => {
      console.log('On DATA set!');
      const parsedData = protocol.parse(data);
      if (this.cmdCallback && typeof this.cmdCallback === 'function') {
        this.cmdCallback(parsedData);
      }
    });
  }
}