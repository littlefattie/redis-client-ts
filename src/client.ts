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
export type ObjFieldValue = string | number | Date | null;

export type ObjInRedis = {
  [key: string]: ObjFieldValue;
}
export interface ZSetItem {
  name: string;
  score: number;
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
  delete(...keys: string[]): Promise<void>;

  // Counter commands
  incr(counter: string): Promise<number>;
  decr(counter: string): Promise<number>;
  incrBy(counter: string, inc: number): Promise<number>;
  setCounter(counterName: string, value: number): Promise<number>;
  getCounter(counterName: string): Promise<number>;
  
  // Hash(Object) functions
  setObject(key: string, obj: ObjInRedis): Promise<void>;
  getObject(key: string): Promise<ObjInRedis>;
  setHashField(key: string, field: string, value: ObjFieldValue): Promise<void>;
  getHashField(key: string, field: string): Promise<ObjFieldValue>;
  setMultipleHashField(key: string, fieldValues: { [field: string]: ObjFieldValue}): Promise<void>;
  getMultipleHashField(key: string, fields: string[]): Promise<ObjFieldValue[]>;
  getHashFields(key: string): Promise<string[]>;

  // Ordinary use
  get(key: string): Promise<ObjFieldValue>;
  set(key: string, value: ObjFieldValue, expireInMs?: number, nxORxx?: "NX" | "XX"): Promise<void>;
  mget(...keys: string[]): Promise<ObjFieldValue[]>;
  mset(keys?: string[], values?: string[]): Promise<void>;
  mset(...keyValPairs: string[]): Promise<void>;

  // Key related
  hasKey(keyPattern: string): Promise<boolean>;
  keyExists(key: string): Promise<boolean>;
  keyAllExists(keys: string[]): Promise<boolean>;

  // List Related
  writeList(key: string, list: ObjFieldValue[]): Promise<void>;
  readList(key: string): Promise<ObjFieldValue[]>;
  getListItemAt(key: string, index: number): Promise<ObjFieldValue>;
  setListItemAt(key: string, item: ObjFieldValue, index: number): Promise<void>;
  removeListItemAt(key: string, index: number): Promise<void>;
  addToList(key: string, items: ObjFieldValue[], position?: "prepend" | "append" | "atindex", index?: number): Promise<void>;
  findItemInList(key: string, item: ObjFieldValue): Promise<number[]>;

  // Set Actions
  addToSet(key: string, items: (string | number)[]): Promise<void>;
  removeItemsFromSet(key: string, items: (string | number)[]): Promise<void>;
  getSetItems(key: string): Promise<string[]>;
  isItemInSet(key: string, item: (string | number)): Promise<boolean>;
  
  // Sorted Set
  zAddToSet(key: string, members: ZSetItem[], nxORxx?: "NX" | "XX", ltORgt?: "LT" | "GT"): Promise<void>;
  zGetCount(key: string): Promise<number>;
  zGetCountWithScoreIn(key: string, min: number, max: number): Promise<number>;
  zIncrBy(key: string, member: string, inc: number): Promise<number>;
  zGetTopItems(key: string, count: number): Promise<ZSetItem[]>;
  zGetBottomItems(key: string, count: number): Promise<ZSetItem[]>;
  zGetRank(key: string, member: string): Promise<number>;
  zGetItemsWithScoresIn(key: string, scoreMin: number, scoreMax: number): Promise<ZSetItem[]>;
  zGetScoresOfMembers(key: string, members: string[], redisVerAbove620?:boolean): Promise<(number | null)[]>;
  zRemoveMembers(key: string, members: string[]): Promise<void>;

  // Expire methods
  expireAfter(key: string, time: number, inMilliSec?: boolean): Promise<boolean>;
  expireAt(key: string, time: Date, useMilliSec?: boolean): Promise<boolean>;
  getTTL(key: string, inMilliSec?: boolean): Promise<number>;
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

  private timeoutRawCommand?: NodeJS.Timeout;
  private timeoutRawMultiple?: NodeJS.Timeout;
  private timeoutSingleCommand?: NodeJS.Timeout;
  private timeoutMultipleCommand?: NodeJS.Timeout;

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

  /**
   * Create socket by start connection
   * @param options Options of the client, will be used to make socket connection
   * @param ensureReady A flag to indicate if ensure ready check when making the connection
   */
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

  /**
   * Close the socket
   */
  public close(): void {
    // Clear Command timeouts if any
    if (this.timeoutRawCommand) clearTimeout(this.timeoutRawCommand);
    if (this.timeoutRawMultiple) clearTimeout(this.timeoutRawMultiple);
    if (this.timeoutSingleCommand) clearTimeout(this.timeoutSingleCommand);
    if (this.timeoutMultipleCommand) clearTimeout(this.timeoutMultipleCommand);

    if (this.socket) {
      this.socket.end();
      this.socket.destroy();
    }
  }
  
  /**
   * Test the socket connection by sending PING command.
   * @returns Resolve if test successful
   */
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

  /**
   * Make auth for the connection.
   * @param password The password for AUTH
   * @param username The username for AUTH
   * @returns Resolve if AUTH successful
   */
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

  /**
   * Check if this client is ready or not.
   */
  public isReady(): Promise<void> {
    if (this.state === RedisClient.states.READY) {
      return Promise.resolve();
    }
    return this.testConnection()
      .then(() => {
        this.getReady();
      });
  }

  /**
   * Attach event listeners for socket or this module.
   * @param event Event name
   * @param listener Event listener
   */
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

  /**
   * Get response from Server in RESP protocol format.
   * @param cmds Redis commands presented in array
   * @returns The response from redis server, in RESP protocol format
   */
  public rawCommand(...cmds: RespCommand): Promise<RespResponse[]> {
    if (this.state !== RedisClient.states.CONNECTED  && this.state !== RedisClient.states.READY) {
      return Promise.reject("The client is not ready!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = protocol.encode(cmds);
      (this.socket as Socket).write(cmdOut);
      // Setup timeout setting 
      this.timeoutRawCommand = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command  ${cmds[0]} timeout occured after ${this.options.timeout.cmd / 1000} seconds.`)
      }, this.options.timeout.cmd);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        if (this.timeoutRawCommand) clearTimeout(this.timeoutRawCommand);
        resolve(data);
        this.cmdCallback = undefined;
      }
    });
  }

  /**
   * Send multiple commands to Redis server and got RAW response
   * @param cmds The multiple commands
   * @returns RESP response in array
   */
  public rawCommandInPipeLine(cmds: RespCommand[]): Promise<RespResponse[]> {
    if (this.state !== RedisClient.states.READY) {
      return Promise.reject("Client is not in READY state!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = cmds.map(cmd => protocol.encode(cmd)).join("");
      (this.socket as Socket).write(cmdOut);
      // Setup timeout setting 
      this.timeoutRawMultiple = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command  ${cmds[0][0]} timeout occured after ${this.options.timeout.cmd / 1000} seconds.`)
      }, this.options.timeout.cmd);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        if (this.timeoutRawMultiple) clearTimeout(this.timeoutRawMultiple);
        resolve(data);
        // Remove the callback after execution
        this.cmdCallback = undefined;
      }
    });
  }

  /**
   * Send a command to Redis server and get response, with pure content returned.
   * @param cmds Redis commands
   * @returns The response content of this command
   */
  public singleCommand(...cmds: RespCommand): Promise<RespArrayElement[]> {
    if (this.state !== RedisClient.states.READY) {
      return Promise.reject("Client is not in READY state!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = protocol.encode(cmds);
      (this.socket as Socket).write(cmdOut);
      // Setup timeout
      this.timeoutSingleCommand = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command ${cmds[0]} timeout occured after ${this.options.timeout.cmd / 1000} seconds.`);
      }, this.options.timeout.cmd);
      // Assign callback
      this.cmdCallback = (data: Array<RespResponse>) => {
        if (this.timeoutSingleCommand) clearTimeout(this.timeoutSingleCommand);
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

  /**
   * Send multiple commands to Redis server and get response
   * @param cmds The multiple commands
   * @returns The response content presented in array
   */
  public commandsInPipeline(cmds: RespCommand[]): Promise<RespArrayElement[][]> {
    if (this.state !== RedisClient.states.READY) {
      return Promise.reject("Client is not in READY state!");
    }
    return new Promise((resolve, reject) => {
      const cmdOut = cmds.map(cmd => protocol.encode(cmd)).join("");
      (this.socket as Socket).write(cmdOut);
      // Setup timeout setting
      this.timeoutMultipleCommand = setTimeout(() => {
        this.cmdCallback = undefined;
        reject(`Command ${cmds[0][0]} timeout occured after ${this.options.timeout.cmd / 1000} seconds.`)
      }, this.options.timeout.cmd);
      // Setup command callback to resolve data parsed
      this.cmdCallback = (data: Array<RespResponse>) => {
        if (this.timeoutMultipleCommand) clearTimeout(this.timeoutMultipleCommand);
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
  public delete(...keys: string[]): Promise<void> {
    return this.singleCommand(...redisCommands.DEL, ...keys)
      .then(res => Promise.resolve());
  }

  /**
   * To increment one counter.
   * @param counter The counter that will be incremented.
   * @returns The new value after incremention
   */
  public incr(counter: string): Promise<number> {
    return this.singleCommand(...redisCommands.INCR, counter)
      .then(res => res[0] as number);
  }
  
  /**
   * To decrement one counter.
   * @param counter The counter that will be decremented.
   * @returns The new value after decremention
   */
  public decr(counter: string): Promise<number> {
    return this.singleCommand(...redisCommands.DECR, counter)
      .then(res => res[0] as number);
  }

  /**
   * Increment a counter by some given amount.
   * @param counter The counter that will be incremented with
   * @param inc The amount to increment
   * @returns The counter value after incrementing
   */
  public incrBy(counter: string, inc: number): Promise<number> {
    return this.singleCommand(...redisCommands.INCRBY, counter, inc)
      .then(res => res[0] as number);
  }

  /**
   * A quick commands to set some Integer to a key, to make it a counter
   * @param counterName The name of the counter.
   * @param value The value that is going to be assigned to the counter.
   * @returns The value that has been set.
   */
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

  /**
   * A special command to get  a counter, the user needs to make sure that the key corresponded is a "counter",
   * or it will be rejected.
   * @param counterName The name of the counter.
   * @returns The returned value of the counter
   */
  public getCounter(counterName: string): Promise<number> {
    return this.singleCommand(...redisCommands.GET, counterName)
      .then(res => {
        const cStr = (res[0] as string).trim();
        const reInt = /^0x[0-9a-fA-F]+|[\+\-]?\d+$/;
        if (reInt.test(cStr)) {
          return Promise.resolve(parseInt(cStr));
        } else {
          return Promise.reject(`${counterName} might be not a counter!`);
        }
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
      // It will also make some conversion for numbers, which will has the format of `number:<nnnn>`.
      // And when read back, this operation will be re-verted.
      const fVal = RedisClient.redisObjFieldVal2Str(obj[k]);
      fieldVals.push(k, fVal);
    }
    const cmds: RespCommand[] = [
      // Delete any current existing on this key
      [...redisCommands.DEL, key],
      // Set New
      [...redisCommands.HSET, key, ...fieldVals],
    ];
    return this.commandsInPipeline(cmds)
      .then(res => { 
        if (res[1] && typeof res[1][0] === "number") {
          return Promise.resolve();
        } else {
          return Promise.reject(`Set Object to ${key} failed!`);
        }
      });
  }

  /**
   * The ultility function to convert obj field value to string which will be stored in Redis
   * @param v The Object field value, could be a string, a number, or a Date
   * @returns The converted string, if number or date, it will be contered as `number:<1234567>` or `date:<1641725773545>`
   */
  static redisObjFieldVal2Str(v: ObjFieldValue): string | null {
    if (v === null) {
      // NOTICE: Here the null conversion is required, because redis cannot accept a `null` as 'value' set to some key.
      //         So if we need to present some real `null` value in the database, we need to make such conversion.
      return `null:<null>`;
    } else if ((v instanceof Date) || typeof v === "object") {
      return `date:<${(v as Date).getTime()}>`;
    } else if (typeof v === "number") {
      return `number:<${v as number}>`;
    } else {
      return v;
    }
  }

  /**
   * The reversing function of `redisObjFieldVal2Str`, to convert the string retrieved from Redis to some field value which might be number,
   * date or string.
   * @param v The string value retrieved from Redis
   * @returns The reverted value, if it has some predefined number format like `number:<1234567>`, or date format like `date:<1641725773545>`
   * then it will be converted to number `1234567` or date `new Date(1641725773545)`;
   */
  static str2RedisObjFieldVal(v: string | null): ObjFieldValue {
    if (v === null) return null;

    const reFloat = /^number:<([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)>$/;
    const reInt = /^number:<(0x[0-9a-fA-F]+|[\+\-]?\d+)>$/;
    const reDate = /^date:<(\d+)>$/;

    if (reInt.test(v)) {
      return parseInt((reInt.exec(v) as RegExpExecArray)[1]) as number;
    } else if (reFloat.test(v)) {
      return parseFloat((reInt.exec(v) as RegExpExecArray)[1]) as number;
    } else if (reDate.test(v)){
      return new Date(parseInt((/^date:<(\d+)>$/.exec(v) as RegExpExecArray)[1]));
    } else if (v === "null:<null>"){
      return null;
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
            const v = res[idx + 1] as string | null;
            resObj[k] = RedisClient.str2RedisObjFieldVal(v);
            idx += 2;
          }
        }
        return resObj;
      });
  }

  /**
   * Set one field of some hash.
   * @param key The key of the hash.
   * @param field The field name of the hash that is going to be set some value.
   * @param value The value of the `field`
   * @returns Resolve if successful
   */
  public setHashField(key: string, field: string, value: ObjFieldValue): Promise<void> {
    return this.singleCommand(...redisCommands.HSET, key, field, RedisClient.redisObjFieldVal2Str(value))
      .then(res => Promise.resolve());
  }

  /**
   * Get the value of some field, just one field.
   * @param key The name of the hash
   * @param field The field name that we want to get some value from
   * @returns The value of the `field` specified.
   */
  public getHashField(key: string, field: string): Promise<ObjFieldValue> {
    return this.singleCommand(...redisCommands.HGET, key, field)
      .then(res => RedisClient.str2RedisObjFieldVal(res[0] as string | null))
  }

  /**
   * The quick command to set multiple values to some hash. It is designed for the purpose that the user want to 'Update' some fields of a hash,
   * or 'Add' some fields. Not designed to create new a new hash, if that is meant, the `setObject()` might be better choice.
   * @param key The name of the hash
   * @param fieldValues The field/value paires organized in an object form
   * @returns Resolve if successful
   */
  public setMultipleHashField(key: string, fieldValues: { [field: string]: ObjFieldValue}): Promise<void> {
    const fvs:RespCommand = [];
    for (let k in fieldValues) {
      fvs.push(k, RedisClient.redisObjFieldVal2Str(fieldValues[k]));
    }
    return this.singleCommand(...redisCommands.HSET, key, ...fvs)
      .then(res => Promise.resolve());
  }

  /**
   * The quick command to get multiple hash fields' values from a hash.
   * @param key The name of the hash
   * @param fields The fields you want to query
   * @returns The queried results in fields order, if the field doesn't exist, then null will be presented.
   */
  public getMultipleHashField(key: string, fields: string[]): Promise<ObjFieldValue[]> {
    return this.singleCommand(...redisCommands.HMGET, key, ...fields)
      .then(res =>{
        const resConverted = res.map(r =>
          (r === null ? null : RedisClient.str2RedisObjFieldVal(r as string | null)));
        return Promise.resolve(resConverted);
      });
  }

  /**
   * The quick command to get all the fields of a Hash.
   * @param key The name of the hash
   * @returns The field names of the hash presented in array
   */
  public getHashFields(key: string): Promise<string[]> {
    return this.singleCommand(...redisCommands.HKEYS, key)
      .then(res => Promise.resolve(res as string[]))
  }

  /**
   * The general command of GET
   * @param key Name of the key
   * @returns Value of the key
   */
  public get(key: string): Promise<ObjFieldValue> {
    return this.singleCommand(...redisCommands.GET, key)
      .then(res => RedisClient.str2RedisObjFieldVal(res[0] as string | null));
  }

  /**
   * The general command of SET
   * @param key Name of the key
   * @param value Value of the key, it could be a string, number, or date
   * @param expireInMs How long it will be expired after set
   * @param nxORxx switch of NX(not exists) or XX(exists)
   * @returns Resolve if successfully set
   */
  public set(key: string, value: ObjFieldValue, expireInMs?: number, nxORxx?: "NX" | "XX"): Promise<void> {
    const params = [key, RedisClient.redisObjFieldVal2Str(value)];
    if (expireInMs) {
      const expireParam = expireInMs > 5000
        ? [`EX`, Math.round(expireInMs/1000).toString()]
        : ['PX', expireInMs.toFixed()];
      params.push(...expireParam);
    }
    if (nxORxx) {
      params.push(nxORxx);
    }
    return this.singleCommand(...redisCommands.SET, ...params)
      .then(() => Promise.resolve());
  }

  /**
   * The Multiple GET
   * @param keys Keys you want to get values from
   * @returns The values returned
   */
  public mget(...keys: string[]): Promise<ObjFieldValue[]> {
    return this.singleCommand(...redisCommands.MGET, ...keys)
      .then(res => res.map(r => RedisClient.str2RedisObjFieldVal(r as string | null)));
  }

  /**
   * This is for the command MSET, keys and values are organized in seperate arrays
   * @param keys The keys you are going to set values to
   * @param values Values
   */
  public mset(keys?: string[], values?: string[]): Promise<void>;
  /**
   * Command MSET with keys and values organized in flatten form.
   * @param keyValPairs Keys and Values presented in flatten form, i.e. [key1, val1, key2, val2, ...]
   */
  public mset(...keyValPairs: string[]): Promise<void>;
  public mset(keys?: any, values?: any, ...keyValPairs: any[]): Promise<void> {
    const kvArray: string[] = [];
    if (keys && values) {
      // Data passed in with keys and values arrays
      if (keys instanceof Array && values instanceof Array) {
        if (keys.length === values.length) {
          if (keys.length === 0) return Promise.resolve();
          for (let i = 0; i < keys.length; i++) {
            kvArray.push(keys[i], values[i]);
          }
        } else {
          Promise.reject("Please present Keys and Values same length of Array.");
        }
      } else if (typeof keys === "string" && typeof values === "string") {
        kvArray.push(keys, values);
        if (keyValPairs.length > 0 && keyValPairs.length % 2 === 0) {
          kvArray.push(...keyValPairs);
        } else {
          Promise.reject("Please provide keyValPairs in event count!");
        }
      }
    } else {
      // Other formats will be rejected.
      Promise.reject("Parameters passed in are not in correct format!");
    }
    if (kvArray.length > 0) {
      return this.singleCommand(...redisCommands.MSET, ...kvArray)
        .then(res => Promise.resolve());
    } else {
      return Promise.resolve();
    }
  }

  /**
   * If Redis has some Key with the pattern specified.
   * @param keyPattern The keys querying pattern, like '*', same as the "KEYS"
   * @returns Boolean state of whether keys specified by the pattern exists
   */
  public hasKey(keyPattern: string): Promise<boolean> {
    return this.singleCommand(...redisCommands.KEYS, keyPattern)
      .then(res => Promise.resolve(res.length > 0));
  }

  /**
   * Another key check command, for single certain key.
   * @param key the key you want to check
   * @returns Whether the key exists
   */
  public keyExists(key: string): Promise<boolean> {
    return this.singleCommand(...redisCommands.EXISTS, key)
      .then(res => Promise.resolve(res.length === 1));
  }

  /**
   * A function to check if all the keys provided exist, if one of them doesn't exist,
   * it will return false.
   * @param keys The keys collection you want to check
   * @returns Whether the key all exists
   */
  public keyAllExists(keys: string[]): Promise<boolean> {
    if (keys.length < 1) {
      return Promise.resolve(true);
    }
    return this.singleCommand(...redisCommands.EXISTS, ...keys)
      .then(res => Promise.resolve(res.length === keys.length));
  }

  /**
   * The command to write a complete new list, which means the old (if any with the same name) will be deleted, and new list with values 
   * stored to the same name.
   * @param key The name of the list
   * @param list The values of the list
   * @returns Resolve if Succeeded
   */
  public writeList(key: string, list: ObjFieldValue[]): Promise<void> {
    const cmds: RespCommand[] = [
      [...redisCommands.DEL, key],
      [...redisCommands.RPUSH, key, ...(list.map(v => RedisClient.redisObjFieldVal2Str(v)))],
    ];
    return this.commandsInPipeline(cmds)
      .then(res => Promise.resolve());
  }

  /**
   * Read all the items in a list.
   * @param key The name of the list
   * @returns All the items in the list
   */
  public readList(key: string): Promise<ObjFieldValue[]> {
    return this.singleCommand(...redisCommands.LRANGE, key, 0, -1)
      .then(res =>res.map(r => RedisClient.str2RedisObjFieldVal(r as string | null)));
  }

  /**
   * Get list item at specified index.
   * @param key Name of the list
   * @param index The index of the element that is going to retrieve at
   * @returns The item value
   */
  public getListItemAt(key: string, index: number): Promise<ObjFieldValue> {
    return this.singleCommand(...redisCommands.LINDEX, key, index)
      .then(res => Promise.resolve(RedisClient.str2RedisObjFieldVal(res[0] as string | null)));
  }

  /**
   * Set specified item to certain index. Please notice that when index is out of range, the Promise will be rejected, because it will
   * result some error, and will lead an Promise Rejection. The futher callbacks need to handle this.
   * @param key Name of the list
   * @param item The new item that is going to be at the specified index
   * @param index The index where to make this operation
   * @returns Solve if operation successful
   */
  public setListItemAt(key: string, item: ObjFieldValue, index: number): Promise<void> {
    return this.singleCommand(...redisCommands.LSET, key, index, RedisClient.redisObjFieldVal2Str(item))
      .then(res => Promise.resolve());
  }
  
  /**
   * Remove one element from the list at some index given. This action involves two operations, one is pop out the elements before the index
   * (if the index is nearer to head), or after the index (if the index is nearer to tail); another is "push back" the elements just retrieved
   * but exclude the item at `index` that you specified.
   * @param key The name of the list
   * @param index The index of the item that is going to be removed
   * @returns Resolve if succedded
   */
  public removeListItemAt(key: string, index: number): Promise<void> {
    return this.singleCommand(...redisCommands.LLEN, key)
      .then(res => {
        const llen = res[0] as number;
        if (llen === 0) Promise.reject(`List "${key}" is empty!`);
        if (index >= llen) Promise.reject(`Index [${index}] is out of Range, Length of List ${key} is ${llen}.`);
        if (index < 0) {
          index = index + llen;
          if (index < 0) Promise.reject(`Index ${index} is out of range! List length is ${llen}.`);
        }
        if (index <= llen / 2) {
          const cmds: RespCommand[] = [];
          for (let i = 0; i <= index; i++) {
            cmds.push([...redisCommands.LPOP, key]);
          }
          return this.commandsInPipeline(cmds)
            .then(res => {
              const unchanged = res.map(r => r[0] as string | null)
                .filter((x, i) => i < res.length - 1);
              // Push back
              return unchanged.length > 0
                ? this.singleCommand(...redisCommands.LPUSH, key, ...unchanged.reverse())
                    .then(x => Promise.resolve())
                : Promise.resolve();
            });
        } else {
          const cmds: RespCommand[] = [];
          for (let i = index; i < llen; i++) {
            cmds.push([...redisCommands.RPOP, key]);
          }
          return this.commandsInPipeline(cmds)
            .then(res => {
              const unchanged = res.map(r => r[0] as string | null)
                .filter((x, i) => i < res.length - 1);
              // Push back
              return unchanged.length > 0
              ? this.singleCommand(...redisCommands.RPUSH, key, ...unchanged.reverse())
                  .then(x => Promise.resolve())
              : Promise.resolve();
            });
        }
      });
  }

  /**
   * Add some items to the currently existing list, if not existing, the list with given key as name will be created.
   * @param key The name of the list
   * @param items The items that are going to insert to the list
   * @param position The postion choice of this insert operation, either prepend (at the beginning), append (at the end), or atindex
   * which means insert at given index. If you specify postion as `atindex`, but not provide the `index`, then the items will be added
   * to tail, same result as `append`.
   * @param index The position if the 
   * @returns Resolve if successfully done
   */
  public addToList(key: string, items: ObjFieldValue[], position?: "prepend" | "append" | "atindex", index?: number): Promise<void> {
    const newItems = [];
    if (items.length < 1) return Promise.resolve();
    const operation = position ?? "append";
    const itemsToInsert = items.map(x => RedisClient.redisObjFieldVal2Str(x));

    return this.singleCommand(...redisCommands.LLEN, key)
      .then(res => {
        const llen = res[0] as number;
        let pos: number;
        // Resolve the positon to insert
        if (position && position === "atindex") {
          if (index) {
            if (index >= 0 && index < llen) {
              pos = index;
            } else if (index >= llen) {
              pos = llen;
            } else {
              pos = llen + index;
              pos = pos < 0 ? 0 : pos;
            }
          } else {
            pos = llen;
          }
        } else if (position && position === "prepend") { 
          pos = 0;
        } else {
          pos = llen;
        }
        // Insert
        if (pos >= llen) {
          // Append to tail
          return this.singleCommand(...redisCommands.RPUSH, key, ...itemsToInsert)
            .then(res => Promise.resolve());
        } else if (pos === 0) {
          // Insert to the beginning
          return this.singleCommand(...redisCommands.LPUSH, key, ...itemsToInsert.reverse())
            .then(res => Promise.resolve());
        } else {
          // If insert to "middle" of the list
          if (pos <= llen / 2) {
            const cmds: RespCommand[] = [];
            for (let i = 0; i < pos; i++) {
              cmds.push([...redisCommands.LPOP, key]);
            }
            return this.commandsInPipeline(cmds)
              .then(res => {
                const lpoped = res.map(r => r[0] as string | null);
                lpoped.push(...itemsToInsert);
                return this.singleCommand(...redisCommands.LPUSH, key, ...lpoped.reverse())
                  .then(x => Promise.resolve());
              });
          } else {
            const cmds: RespCommand[] = [];
            for (let i = pos; i < llen; i++) {
              cmds.push([...redisCommands.RPOP, key]);
            }
            return this.commandsInPipeline(cmds)
              .then(res => {
                const rpoped = res.map(r => r[0] as string | null);
                itemsToInsert.push(...rpoped.reverse());
                return this.singleCommand(...redisCommands.RPUSH, key, ...itemsToInsert)
                  .then(x => Promise.resolve());
              });
          }
        }
      });
  }


  /**
   * Find ALL the occurrance of certain item specified.
   * @param key Name of the list
   * @param item Item you are going to find in the list
   * @returns The indice of the item you specified, multiple value if multiple occurance, empty if no occurance.
   */
  public findItemInList(key: string, item: ObjFieldValue): Promise<number[]> {
    return this.singleCommand(...redisCommands.LLEN, key)
      .then(res => {
        const llen = res[0] as number;
        if (llen === 0) return Promise.resolve([]);
        return this.singleCommand(...redisCommands.LPOS, key, RedisClient.redisObjFieldVal2Str(item), 'COUNT', llen)
          .then(res => Promise.resolve(res as number[]));
      });
  }

  /**
   * Add some elements to a set.
   * @param key name of the set
   * @param items the elements/members that are going to be added to the set
   * @returns Resolve when succeeded
   */
  public addToSet(key: string, items: (string | number)[]): Promise<void> {
    return this.singleCommand(...redisCommands.SADD, key, ...items)
      .then(res => Promise.resolve());
  }

  /**
   * Remove items from a set.
   * @param key Name of the set
   * @param items The elements/members that are going to be removed from the set.
   * @returns Resolve when succeeded
   */
  public removeItemsFromSet(key: string, items: (string | number)[]): Promise<void> {
    return this.singleCommand(...redisCommands.SREM, key, ...items)
      .then(res => Promise.resolve());
  }

  /**
   * Get all the members of a set.
   * @param key Name of the set.
   * @returns All the members of the set
   */
  public getSetItems(key: string): Promise<string[]> {
    return this.singleCommand(...redisCommands.SMEMBERS, key)
      .then(res => Promise.resolve(res as string[]));
  }

  /**
   * To test if an element is in the specified set.
   * @param key Name of the set
   * @param item The item we are going to test
   * @returns True if in the set.
   */
  public isItemInSet(key: string, item: string | number): Promise<boolean> {
    return this.singleCommand(...redisCommands.SISMEMBER, key, item)
      .then(res => Promise.resolve((res[0] as number) === 1));
  }

  /**
   * Add one memeber/element to the sorted set.
   * @param key Name of the sorted set
   * @param members member/score pairs that are going to be inserted in to the ZSET. organized in an object.
   * @param nxORxx NX (if not exists) or XX (if exists) option of the `ZADD` command
   * @param ltORgt LT (less than) or GT (greater than) option of the `ZADD` command
   * @returns 
   */
  public zAddToSet(key: string, members: ZSetItem[], nxORxx?: "NX" | "XX", ltORgt?: "LT" | "GT"): Promise<void> {
    if (members.length < 1) return Promise.resolve();
    const memScores: (string | number)[] = members.map(x => [x.score, x.name]).flat();
    const options: string[] = [];
    if (nxORxx) options.push(nxORxx);
    if (ltORgt) options.push(ltORgt);
    return this.singleCommand(...redisCommands.ZADD, key, ...options, ...memScores)
      .then(res => Promise.resolve());
  }

  /**
   * Get the count of the sorted set.
   * @param key Name of the sorted set
   * @returns Count of the set
   */
  public zGetCount(key: string): Promise<number> {
    return this.singleCommand(...redisCommands.ZCARD, key)
      .then(res => Promise.resolve(res[0] as number));
  }

  /**
   * Get how many members are there who have scores between min and max.
   * @param key Name of the sorted set.
   * @param min The min score
   * @param max The max score
   * @returns Count of qualified members
   */
  public zGetCountWithScoreIn(key: string, min: number, max: number): Promise<number> {
    max = max >= min ? max : min;
    return this.singleCommand(...redisCommands.ZRANGEBYSCORE, key, min, max)
      .then(res => Promise.resolve(res.length));
  }

  /**
   * Increment one member by some amount of the given sorted set.
   * @param key Name of the sorted set.
   * @param member The member we are going to increment on
   * @param inc How much to increment
   * @returns The new score after increment
   */
  public zIncrBy(key: string, member: string, inc: number): Promise<number> {
    return this.singleCommand(...redisCommands.ZINCRBY, key, inc, member)
      .then(res => Promise.resolve(parseFloat(res[0] as string)));
  }

  /**
   * Get the top ranked items as per the score. The first, the greatest score the item has.
   * @param key Name of the sorted set
   * @param count How many items to get
   * @returns The top items got
   */
  public zGetTopItems(key: string, count: number): Promise<ZSetItem[]> {
    return this.singleCommand(...redisCommands.ZREVRANGE, key, 0, count - 1, 'WITHSCORES')
      .then(res => {
        const set: ZSetItem[] = [];
        let idx = 0;
        while (idx < res.length) {
          set.push({ name: res[idx] as string, score: parseFloat(res[idx + 1] as string) });
          idx += 2;
        }
        return Promise.resolve(set);
      });
  }

  /**
   * Get the bottom ranked items as per the score. The firt, the least score the item has.
   * @param key Name of the sorted set
   * @param count How many items to get
   * @returns The bottom items got
   */
  public zGetBottomItems(key: string, count: number): Promise<ZSetItem[]> {
    return this.singleCommand(...redisCommands.ZRANGE, key, 0, count - 1, "WITHSCORES")
      .then(res => {
        const set: ZSetItem[] = [];
        let idx = 0;
        while (idx < res.length) {
          set.push({ name: res[idx] as string, score: parseFloat(res[idx + 1] as string) });
          idx += 2;
        }
        return Promise.resolve(set);
      });
  }

  /**
   * Get the rank value of certain member.
   * @param key Name of the sorted set
   * @param member Member of which to find rank value
   * @returns 
   */
  public zGetRank(key: string, member: string): Promise<number> {
    return this.singleCommand(...redisCommands.ZRANK, key, member)
      .then(res => {
        if (res[0]) return Promise.resolve(res[0] as number);
        else return Promise.reject(`Member ${member} might not exist under key ${key}.`);
      });
  }

  /**
   * Get Items in a sorted set that has the score between min and max.
   * @param key Name of the sorted set
   * @param scoreMin min score
   * @param scoreMax max score
   * @returns The members matched
   */
  public zGetItemsWithScoresIn(key: string, scoreMin: number, scoreMax: number): Promise<ZSetItem[]> {
    scoreMax = scoreMax >= scoreMin ? scoreMax : scoreMin;
    return this.singleCommand(...redisCommands.ZRANGEBYSCORE, key, scoreMin, scoreMax, 'WITHSCORES')
      .then(res => {
        const set: ZSetItem[] = [];
        let idx = 0;
        while (idx < res.length) {
          set.push({ name: res[idx] as string, score: parseFloat(res[idx + 1] as string) });
          idx += 2;
        }
        return Promise.resolve(set);
      });
  }

  /**
   * Get the scores of memebers specified.
   * @param key Name of the sorted set
   * @param members Th members of which you are going to get the scores
   * @param redisVerAbove620 This is switch to toggle command to use, default is false
   * @returns The Scores got
   */
  public zGetScoresOfMembers(key: string, members: string[], redisVerAbove620?: boolean): Promise<(number | null)[]> {
    redisVerAbove620 = redisVerAbove620 ?? false;
    /**
     *  NOTE: here, if the redis server is above 6.2.0, we can use the `ZMSCORE` command,
     *  But for older versions, we have to use the command of `ZCORE` multiple times, i.e. in pipeline.
     */
    if (redisVerAbove620) {
      // Method 1 - use `ZMCORE` command
      return this.singleCommand(...redisCommands.ZMSCORE, key, ...members)
        .then(res => Promise.resolve(res.map(r => r ? parseFloat(r as string): null)));
    } else {
      // Method 2 -use multiple `ZSCORE` command
      const cmds: RespCommand[] = [];
      for (let i = 0; i < members.length; i++) {
        cmds.push([...redisCommands.ZSCORE, key, members[i]]);        
      }
      return this.commandsInPipeline(cmds)
        .then(res => Promise.resolve(res.map(r => r[0] ? parseFloat(r[0] as string) : null)));
    }
  }

  /**
   * Remove specife members from a given sorted set.
   * @param key Name of the sorted set.
   * @param members Members that are going to be removed
   * @returns Reslove if succeeded
   */
  public zRemoveMembers(key: string, members: string[]): Promise<void> {
    return this.singleCommand(...redisCommands.ZREM, key, ...members)
      .then(res => Promise.resolve());
  }

  /**
   * Expire some key after some time.
   * @param key The key to expire
   * @param time How long before the key get expired, it is just the number part, e.g. if set to 10,
   * then the real time is 10 sec if `inMilliSec` is not set, or 10 milli-sec if `inMilliSec` is not set
   * or set to `false`.
   * @param inMilliSec Whether use milliseconds as the time unit
   * @returns Whether the expire operation is successful
   */
  public expireAfter(key: string, time: number, inMilliSec?: boolean): Promise<boolean> {
    const cmdUsed = inMilliSec ? redisCommands.PEXPIRE : redisCommands.EXPIRE;
    return this.singleCommand(...cmdUsed, key, time)
      .then(res => Promise.resolve((res[0] as number) === 1));
  }

  /**
   * Expire some key at given time tick.
   * @param key The key to expire
   * @param time When (specified Date/Time)
   * @param useMilliSec An indicator to mark whether use milliseconds as unit to expire the key
   * @returns Whether the expire action is successful or not
   */
  public expireAt(key: string, time: Date, useMilliSec?: boolean): Promise<boolean> {
    const cmdUsed = useMilliSec ? redisCommands.PEXPIREAT : redisCommands.EXPIREAT;
    const msec = time.getTime();
    return this.singleCommand(...cmdUsed, key, useMilliSec ? msec : (msec / 1000))
      .then(res => Promise.resolve((res[0] as number) === 1));
  }

  /**
   * Get the TTL of one key, either in seconds unit or milli seconds unit.
   * @param key Key to query
   * @param inMilliSec A switch to indicate whether get the ttl in milliseconds, if set, the result returned
   * will be in milliseconds.
   * @returns The TTL either in seconds or milli seconds
   */
  public getTTL(key: string, inMilliSec?: boolean): Promise<number> {
    const cmdUsed = inMilliSec ? redisCommands.PTTL : redisCommands.TTL;
    return this.singleCommand(...cmdUsed, key)
      .then(res => {
        const ttl = res[0] as number;
        if (ttl === -2) return Promise.reject(`Key ${key} is not existing.`);
        else if (ttl === -1) return Promise.resolve(Number.MAX_SAFE_INTEGER);
        else return Promise.resolve(ttl);
      });
  }

  /**
   * -----------------------------------   Private methods -------------------------------------------------------------------
   */

  /**
   * Copy options from input to internal
   * @param options The options to build the client
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

  /**
   * Mark client state to ready and execute the callback if any
   */
  private getReady(): void {
    this.state = RedisClient.states.READY;
    // Handle OnReady events.
    if (this.onReady && typeof this.onReady === 'function') {
      this.onReady();
    }
  }

  /**
   * Set client state to error and execute outer callback if set any
   * @param msg The error message that is going to returned to outer module
   */
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

  /**
   * Init the client after the socket is connected, mostly set callbacks for different events
   */
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

    /**
     * THis envent handler will transfer the data received from the socket to attached callbacks from Promises
     */
    skt.on("data", (data: Buffer) => {
      // console.log('On DATA hit!');
      const parsedData = protocol.parse(data);
      if (this.cmdCallback && typeof this.cmdCallback === 'function') {
        this.cmdCallback(parsedData);
      }
    });
  }
}

