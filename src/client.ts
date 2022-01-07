import { createConnection, Socket } from "net";
import { connect, TLSSocket } from "tls";
import { v4 as uuidv4} from "uuid";

import { IRedisClientPool } from "./pool";
import redisCommands from "./commands";
import protocol, { RedisError, RespArrayElement, RespCommand, RespContentType, RespResponse } from "./protocol";  

interface RedisClientTimeoutOptions {
  conn?: number;
  idle?: number;
  cmd?: number;
}
export interface IRedisClientOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  timeout?: RedisClientTimeoutOptions;
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
  state: string;

  // Client handling functions
  loadOptions(options: IRedisClientOptions): void;
  connect(options?: IRedisClientOptions, ensureReady?: boolean): void;
  close(): void;
  testConnection(): Promise<void>;
  auth(password?: string, username?:string): Promise<void>;
  isReady(): Promise<void>;

  // Event handlers
  on(event: "error", listener: (err: Error) => void): void;
  on(event: "close", listener: (hadError: boolean) => void): void;
  on(event: "end", listener: () => void): void;
  on(event: "timeout", listener: () => void): void;
  on(event: "ready", listener: () => void): void;

  // General commands
  // Raw command, which will return the `structured` and `modeled` response
  rawCommand(...cmds: RespCommand): Promise<Array<RespResponse>>;
  rawCommandInPipeLine(cmds: Array<RespCommand>): Promise<Array<RespResponse>>;

  // Normal command, which will return the `pure content` of the response
  singleCommand(...cmds: RespCommand): Promise<RespArrayElement[]>;
  commandsInPipeline(cmds: Array<RespCommand>): Promise<RespArrayElement[][]>;

  // Abstracted commands
  // Delete
  delete(key: string): Promise<void>;

  // Counter commands
  incr(counter: string): Promise<number>;
  decr(counter: string): Promise<number>;
  setCounter(counterName: string, value: number): Promise<number>;
  getCounter(counterName: string): Promise<number>;
  
  // Hash(Object) functions
  setObject(key: string, obj: ObjInRedis): Promise<void>;
  getObject(key: string): Promise<ObjInRedis>;
  setMultipleHashField(key: string, fieldValues: { [field: string]: ObjFieldValue}): Promise<void>;
  setHashField(key: string, field: string, value: ObjFieldValue): Promise<void>;
  getHashField(key: string, field: string): Promise<ObjFieldValue>;

  // Ordinary use
  get(key: string): Promise<string>;
  set(key: string): Promise<void>;
  mget(...keys: string[]): Promise<string[]>;
  mset(keys?: string[], values?: string[]): Promise<void>;
  mset(...keyValPairs: string[]): Promise<void>;

  // Key related
  hasKey(keyPattern: string): Promise<boolean>;
  keyExists(key: string): Promise<boolean>;
  keyAllExists(keys: string[]): Promise<boolean>;
}

// Default timeout choices
const CONN_TIMEOUT_DEFAULT: number = 15000;
const IDLE_TIMEOUT_DEFAULT: number = 30000;
const CMD_TIMEOUT_DEFAULT: number = 10000;

export class RedisClient implements IRedisClient{
  static states = {
    CREATED: "created",
    CONNECTED: "connected",
    READY: "ready",
    ERRORED: "errored",
    // TIMEOUT: "timeout",
  }
  public id: string;
  public state: string;

  private socket?: Socket;

  // The inner options will have all fields set except the username, password and tls.
  private options: Pick<IRedisClientOptions, "username" | "password" | "tls"> & {
    host: string;
    port: number;
    timeout: Required<RedisClientTimeoutOptions>;
  };

  private inPool: boolean = false;

  private connTimeoutHandler?: NodeJS.Timeout;

  private onError?: (err: Error) => void;
  private onClose?: (hadError: boolean) => void;
  private onEnd?: () => void;
  private onTimeout?: () => void;
  private onReady?: () => void;

  private cmdCallback?: (parsedData: Array<RespResponse>) => void;

  /**
   * The constructor of the client.
   * @param options The options that will be used to create the client.
   * @param autoConnect A flag to mark whether intial connecting is required by creation.
   * @param ensureReady A flag to mark whether `Ready` state is need to be ensured when creating the client. If provided as `true`,
   * The client is supposed to be ready after the constructor call.
   * @param inPool This param is used to indicate whether this client is in some pool, if so, it will be initialized with `connection idle`
   * feature in which case the client will be closed and removed by pool management if idle for a long time.
   */
  constructor(options?: IRedisClientOptions, autoConnect?: boolean, ensureReady?: boolean, inPool?: boolean) {
    this.id = uuidv4();
    this.options = {
      host: '127.0.0.1',
      port: 6379, 
      timeout: {
          conn: CONN_TIMEOUT_DEFAULT,
          idle: IDLE_TIMEOUT_DEFAULT,
          cmd: CMD_TIMEOUT_DEFAULT,
        },
    };
    this.inPool = inPool ?? false;
    this.state = RedisClient.states.CREATED;

    // Copy and overrite the default options if options provided
    if (options) {
      this.copyOptions(options);
    }

    // Connect at creation if autoConnect is enabled
    if (autoConnect) {
      // In the constructor, the options has already been copied, so here set the input as `undefined` to bypass it.
      this.connect(undefined, ensureReady);
    }
  }

  /**
   * Set options for the default client. Please note that, this function is mainly used to load options to the "Default"
   * client that is created by "default import", i.e. like `import client from "redis-client-ts"`, which will return a dummy
   * client without any settings and initializations, and you have to load options, and connect, and test connection,
   * and check if ready manually. And this function will just copy the options in, nothing else, for a working (ready) client,
   * the socket is working good, this function will not have any impact on that, the options indeed will be overwritten, but
   * it is not used. To make the options in effect, please use `client.connect()` to make connection, which will also create
   * the socket instance.
   * @param options The options for the client.
   */
  public loadOptions(options: IRedisClientOptions): void {
    this.copyOptions(options);
  }

  public connect(options?: IRedisClientOptions, ensureReady?: boolean): void {
    // Close before connect, this will issue an Re-Connect actually
    this.close();
    // Reset the state to CREATED
    this.state = RedisClient.states.CREATED;
    // Copy and overrite options if provided
    if (options) {
      this.copyOptions(options);
    }
    // Create socket
    this.socket = this.options.tls
      ? connect({
          host: this.options.host,
          port: this.options.port,
          key: this.options.tls.key,
          cert: this.options.tls.cert,
        })
      : createConnection({
          host: this.options.host,
          port: this.options.port,
        });
    // Set connection timeout
    this.connTimeoutHandler = setTimeout(() => {
      this.setError(`Connection timeout after ${this.options.timeout.conn / 1000} seconds.`);
    }, this.options.timeout.conn);

    this.socket.on("error", () => {
      this.setError("Socket Error happened!");   
    })
    // Handler for being connected event
    this.socket.on('connect', async () => {
      // Clear the connection timeout when connected
      clearTimeout(this.connTimeoutHandler ?? setTimeout(() => {}, 0));
      // Init socket after socket connection successfully established.
      this.socketInit();
      this.state = RedisClient.states.CONNECTED;
      // If ensure ready is required, make the connection test to check
      if (ensureReady) {
        await this.testConnection()
          .then(() => this.getReady())
          .catch(() => this.auth()     // Auth with the default username/password provided in options
            .then(() => this.testConnection())
            .then(() => this.getReady())
            .catch(() => {
              this.setError("Basic Communiation test failed!");
            }));
      }
    });
  }

  public close(): void {
    if (this.socket) {
      this.socket.end();
      this.socket.destroy();
    }
  }
  
  public testConnection(): Promise<void> {
    if (this.state !== RedisClient.states.CONNECTED && this.state !== RedisClient.states.READY) {
      return Promise.reject("Client not connected!");
    }
    return this.rawCommand(...redisCommands.PING)
      .then(answer => {
        if (answer.length === 1 && answer[0].content === "PONG") {
          return Promise.resolve();
        } else {
          return Promise.reject('Test with PING Command Failed!');
        }
      })
  }

  public auth(password?: string, username?:string): Promise<void> {
    const pwd = password ?? this.options.password;
    const name = username ?? this.options.username;
    if (!pwd) {
      return Promise.reject('No Password presented, auth rejected!');
    }
    const auth = name ? [name, pwd] : [pwd];
    return this.rawCommand(...redisCommands.AUTH, ...auth)
      .then(authResult => {
        if (authResult.length === 1 && authResult[0].content === "OK") {
          return Promise.resolve();
        } else {
          this.setError("AUTH failed, please check the username and password!")
          return Promise.reject('Auth failed!');
        }
      });
  }

  public isReady(): Promise<void> {
    if (this.state === RedisClient.states.READY) {
      return Promise.resolve();
    }
    return this.testConnection()
      .then(() => {
        this.getReady();
      });
  }

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

  public rawCommand(...cmds: RespCommand): Promise<RespResponse[]> {
    if (this.state !== RedisClient.states.CONNECTED  && this.state !== RedisClient.states.READY) {
      return Promise.reject("The client is not ready!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = protocol.encode(cmds);
      (this.socket as Socket).write(cmdOut);
      // Setup timeout setting 
      const timeoutId = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command timeout occured after ${this.options.timeout.cmd / 1000} seconds.`)
      }, this.options.timeout.cmd);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        clearTimeout(timeoutId);
        resolve(data);
      }
    });
  }

  public rawCommandInPipeLine(cmds: RespCommand[]): Promise<RespResponse[]> {
    if (this.state !== RedisClient.states.READY) {
      return Promise.reject("Client is not in READY state!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = cmds.map(cmd => protocol.encode(cmd)).join("");
      (this.socket as Socket).write(cmdOut);
      // Setup timeout setting 
      const timeoutId = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command timeout occured after ${this.options.timeout.cmd / 1000} seconds.`)
      }, this.options.timeout.cmd);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        clearTimeout(timeoutId);
        resolve(data);
        // Remove the callback after execution
        this.cmdCallback = undefined;
      }
    });
  }

  public singleCommand(...cmds: RespCommand): Promise<RespArrayElement[]> {
    if (this.state !== RedisClient.states.READY) {
      return Promise.reject("Client is not in READY state!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = protocol.encode(cmds);
      (this.socket as Socket).write(cmdOut);
      // Setup timeout
      const timeoutId = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command timeout occured after ${this.options.timeout.cmd / 1000} seconds.`);
      }, this.options.timeout.cmd);
      // Assign callback
      this.cmdCallback = (data: Array<RespResponse>) => {
        clearTimeout(timeoutId);
        if (data.length === 1) {
          const response = data[0];
          if (response.contentType === "error") {
            const err = response.content as RedisError;
            reject(`Error returned: ${err.tag} - ${err.msg}`);
          } else {
            const content = response.contentType === "array" ? (response.content as Array<RespResponse>) : data
            resolve(protocol.translateResult(content));
          }
        } else {
          reject("Command failed!");
        }
        // Remove the callback after execution
        this.cmdCallback = undefined;
      }
    });
  }

  public commandsInPipeline(cmds: RespCommand[]): Promise<RespArrayElement[][]> {
    if (this.state !== RedisClient.states.READY) {
      return Promise.reject("Client is not in READY state!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = cmds.map(cmd => protocol.encode(cmd)).join("");
      (this.socket as Socket).write(cmdOut);
      // Setup timeout setting
      const timeoutId = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command timeout occured after ${this.options.timeout.cmd / 1000} seconds.`)
      }, this.options.timeout.cmd);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        clearTimeout(timeoutId);
        resolve(data.map(x => {
          const array = x.contentType === "array" ? (x.content as Array<RespResponse>) : [x];
          return protocol.translateResult(array);
        }));
        // Remove the callback after execution
        this.cmdCallback = undefined;
      }
    });      
  }

  /**
   * -----------------------   The abstracted quick commands  --------------------------------------------------------
   */
  
  /**
   * Delete one key
   * @param key The key required to disappear.
   * @returns 
   */
  public delete(key: string): Promise<void> {
    return this.rawCommand(...redisCommands.DEL, key)
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
    return this.singleCommand(...redisCommands.INCR, counter)
      .then(res => Promise.resolve(res[0] as number));
  }
  
  /**
   * To decrement one counter.
   * @param counter The counter that will be decremented.
   * @returns The new value after decremention
   */
  public decr(counter: string): Promise<number> {
    return this.singleCommand(...redisCommands.DECR, counter)
      .then(res => Promise.resolve(res[0] as number));
  }

  public setCounter(counterName: string, value: number): Promise<number> {
    const intValue = Number.isInteger(value) ? value : Math.round(value);
    return this.singleCommand(...redisCommands.SET, counterName, value)
      .then(res => this.singleCommand(...redisCommands.GET, counterName))
      .then(res => {
        return parseInt(res[0] as string) === intValue
          ? Promise.resolve(intValue)
          : Promise.reject("Set counter failed!");
      });
  }

  public getCounter(counterName: string): Promise<number> {
    return this.singleCommand(...redisCommands.GET, counterName)
      .then(res => {
          const cVal = parseInt(res[0] as string);
          return Number.isNaN(cVal)
            ? Promise.reject(`${counterName} might be not a counter!`)
            : Promise.resolve(cVal);
        });
  }

  /**
   * A easy and convenient function to store a whole object ({[k]: v}) into Redis.
   * @param key The key of the Hash set in Redis, i.e. the `Name` of this object going to be saved as.
   * @param obj The Object being stored in to Resis. e.g.
   * obj = {
   *   n: 33,
   *   s: 'Tom',
   *   d: new Date()
   * }
   * @returns A promise to signal whether action successful
   */
  public setObject(key: string, obj: ObjInRedis): Promise<void> {
    const fieldVals: RespCommand = [];
    for (let k in obj) {
      // If the field value is Date, then convert it to a string in the format of
      // `date:<nnnnnnn>` where `nnnnnnn` is the milisec timestamp returned by the funciton of `getTime`.
      // And when read back, this operation will be re-verted.
      const fVal = RedisClient.redisObjFieldVal2Str(obj[k]);
      fieldVals.push(k, fVal);
    }
    return this.singleCommand(...redisCommands.HSET, key, ...fieldVals)
      .then(res => Promise.resolve());
  }

  static redisObjFieldVal2Str(v: ObjFieldValue): string {
    return ((v instanceof Date) || typeof v === 'object')
      ? `date:<${(v as Date).getTime}>`
      : `${v as (string | number)}`;
  }

  static str2RedisObjFieldVal(v: string): ObjFieldValue {
    const isValFloat = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(v);
    const isValInt = /^(0x[0-9a-fA-F]+)$|^([\+\-]?\d+)$/.test(v);
    const isValDate = /^date:<(\d+)>$/.test(v);
    if (isValInt) {
      return parseInt(v) as number;
    } else if (isValFloat) {
      return parseFloat(v) as number;
    } else if (isValDate){
      return new Date(parseInt((/^date:<(\d+)>$/.exec(v) as RegExpExecArray)[1]));
    } else {
      return v;
    }
  }

  /**
   * The paired/inverted function of `setObject()` above.
   * @param key The key of redis database, or the name of the object you are going to retrieve.
   * @returns The detailed value of the object
   */
  public getObject(key: string): Promise<ObjInRedis> {
    return this.singleCommand(...redisCommands.HGETALL, key)
      .then(res => {
        if (res.length === 1 && typeof res[0] === "object") {
          return Promise.reject('Error returned while retrieving!');
        }
        let resObj: ObjInRedis = {};
        if (res.length >= 2) {
          let idx = 0;
          while(idx < res.length) {
            const k = res[idx] as string;
            const v = res[idx + 1] as string;
            resObj[k] = RedisClient.str2RedisObjFieldVal(v);

            const isValFloat = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(v);
            const isValInt = /^(0x[0-9a-fA-F]+)$|^([\+\-]?\d+)$/.test(v);
            const isValDate = /^date:<(\d+)>$/.test(v);
            if (isValInt) {
              resObj[k] = parseInt(v) as number;
            } else if (isValFloat) {
              resObj[k] = parseFloat(v) as number;
            } else if (isValDate){
              resObj[k] = new Date(parseInt((/^date:<(\d+)>$/.exec(v) as RegExpExecArray)[1]));
            } else {
              resObj[k] = v as string;
            }
            idx += 2;
          }
        }
        return Promise.resolve(resObj);
      });
  }

  public setHashField(key: string, field: string, value: ObjFieldValue): Promise<void> {
    return this.singleCommand(...redisCommands.HSET, key, field,RedisClient.redisObjFieldVal2Str(value))
      .then(res => Promise.resolve());
  }

  public getHashField(key: string, field: string): Promise<ObjFieldValue> {
    return this.singleCommand(...redisCommands.HGET, key, field)
      .then(res => Promise.resolve(RedisClient.str2RedisObjFieldVal(res[0] as string)))
  }

  public setMultipleHashField(key: string,fieldValues: {[field: string]: ObjFieldValue}): Promise<void> {
    const cmds:string[] = [];
    for (let k in fieldValues) {
      cmds.push(k, RedisClient.redisObjFieldVal2Str(fieldValues[k]));
    }
    return this.singleCommand(...redisCommands.HSET, key, ...cmds)
      .then(res => Promise.resolve());
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

  public hasKey(keyPattern: string): Promise<boolean> {
    return this.singleCommand(...redisCommands.KEYS, keyPattern)
      .then(res => Promise.resolve(res.length > 0));
  }

  public keyExists(key: string): Promise<boolean> {
    return this.singleCommand(...redisCommands.EXISTS, key)
      .then(res => Promise.resolve(res.length === 1));
  }

  public keyAllExists(keys: string[]): Promise<boolean> {
    if (keys.length < 1) {
      return Promise.resolve(true);
    }
    return this.singleCommand(...redisCommands.EXISTS, ...keys)
      .then(res => Promise.resolve(res.length === keys.length));
  }

  /**
   * -----------------------------------   Private methods -------------------------------------------------------------------
   */

  private copyOptions(options: IRedisClientOptions): void {
    this.options.host = options?.host ?? this.options.host;
    this.options.port = options?.port ?? this.options.port;
    this.options.username = options?.username ?? this.options.username;
    this.options.password = options?.password ?? this.options.password;
    this.options.timeout.conn = options?.timeout?.conn ?? this.options.timeout.conn;
    this.options.timeout.idle = options?.timeout?.idle ?? this.options.timeout.idle;
    this.options.timeout.cmd = options?.timeout?.cmd ?? this.options.timeout.cmd;
    this.options.tls = options?.tls ?? this.options.tls;
  }

  private getReady(): void {
    this.state = RedisClient.states.READY;
    // Handle OnReady events.
    if (this.onReady && typeof this.onReady === 'function') {
      this.onReady();
    }
  }

  private setError(msg: string): void {
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
    const skt = this.socket as Socket;
    skt.on("end", () => {
      if (this.onEnd && typeof this.onEnd === 'function') {
        this.onEnd();
      }
    })

    skt.on("close", (hadError: boolean) => {
      if (this.onClose && typeof this.onClose === 'function') {
        this.onClose(hadError);
      }
    })

    if (this.inPool) {
      skt.setTimeout(this.options.timeout.idle);
      skt.on("timeout", () => {
        // Handle the callback set by outer module first
        if (this.onTimeout && typeof this.onTimeout === 'function') {
          this.onTimeout();
        }
      })
    }

    skt.on("data", (data: Buffer) => {
      console.log('On DATA hit!');
      const parsedData = protocol.parse(data);
      if (this.cmdCallback && typeof this.cmdCallback === 'function') {
        this.cmdCallback(parsedData);
      }
    });
  }
}