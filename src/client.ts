import { rejects } from "assert";
import { timeStamp } from "console";
import { createConnection, Socket } from "net";
import { connect, TLSSocket } from "tls";
import { v4 as uuidv4} from "uuid";
import { IRedisClientPool } from "./pool";

import protocol, { RespResponse } from "./protocol";  

export interface IRedisClientOptions {
  host?: string;
  port?: number;
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
  mset(keys: string[], values: string[]): Promise<void>;
  mset(...keyValPairs: string[]): Promise<void>;

  hasKey(keyPattern: string);
}

const CONN_TIMEOUT: number = 30000;
const CMD_TIMEOUT: number = 10000;

export class RedisClient implements IRedisClient{
  static states = {
    CREATED: "created",
    READY: "ready",
    ERRORED: "errored",
    TIMEOUT: "timeout",
  }
  public id: string;
  public state: string;

  private socket: Socket;
  private options: IRedisClientOptions;
  private inPool: boolean = false;

  private onError?: () => void;
  private onClose?: () => void;
  private onEnd?: () => void;
  private onTimeout?: () => void;
  private onReady?: () => void;
  private pool?: IRedisClientPool;


  constructor(options?: IRedisClientOptions, inPool?: boolean) {
    this.id = uuidv4();
    this.options = {};
    this.options.host = options?.host || '127.0.0.1';
    this.options.port = options?.port || 6379;
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
      console.error("Socket on ERROR!");
      if (this.onError && typeof this.onError === "function") {
        console.log("SOCKET ERROR emited to outer module.")
        this.onError();
      }
    })
    
    this.socket.on('connect', () => {
      // Init socket after socket successfully established.
      this.socketInit();
      this.state = RedisClient.states.READY;
      // Handle OnReady events.
      if (this.onReady && typeof this.onReady === 'function') {
        this.onReady();
      }
    });

  }

  public close(): void {
    this.socket.end();
    this.socket.destroy();
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
      this.socket.write(cmdOut)
      // waiting for The resolve on "data" event
    });
  }

  public delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {

    });
  }

  private async auth(password: string) {
    try {
      return await this.rawCommand("AUTH", password);
    } catch (error) {
      this.socket.emit("error", error);
      this.socket.end();
    }
  }

  private socketInit(): void {
    
    this.socket.on("end", () => {
      if (this.onEnd && typeof this.onEnd === 'function') {
        this.onEnd();
      }
    })

    this.socket.on("close", () => {
      if (this.onClose && typeof this.onClose === 'function') {
        this.onClose();
      }
    })

    if (this.inPool) {
      this.socket.setTimeout(CONN_TIMEOUT);
      this.socket.on("timeout", () => {
        // Handle te callback set by outer module first
        if (this.onTimeout && typeof this.onTimeout === 'function') {
          this.onTimeout();
        }
      })
    }

    this.socket.on("data", (data: Buffer) => {

    });
  }
}