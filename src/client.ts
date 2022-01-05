import { createConnection, Socket } from "net";
import { connect, TLSSocket } from "tls";
import { v4 as uuidv4} from "uuid";

import protocol from "./protocol";  

export interface clientOptions {
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

  rawCommand(...cmds: Array<string | number>): Promise<any>;

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

class RedisClient implements IRedisClient{
  public id: string;
  private socket: Socket;
  private options: clientOptions;


  constructor(options?: clientOptions) {
    this.id = uuidv4();
    this.options = {};
    this.options.host = options?.host || '127.0.0.1';
    this.options.port = options?.port || 6379;
    this.options.password = options?.password;
    this.options.timeout = options?.timeout || 5000;
    this.options.tls = options?.tls;

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

    this.socket.on('connect', () => {
      this.socket.setTimeout(CONN_TIMEOUT);
      this.socket.on("timeout", () => {
        this.socket.end();
      })
    });
    this.socket.setTimeout(CONN_TIMEOUT);

    if (this.socket.)
    if (options?.timeout) {
    }
  }
}