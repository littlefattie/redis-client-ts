import { timeStamp } from "console";
import { IRedisClient, IRedisClientOptions, RedisClient } from "./client"; 

const client = new RedisClient();

export interface IRedisClientPoolOptions extends  IRedisClientOptions {
  connMax?: number;
  connMin?: number;
}

export interface IRedisClientPool {
  connMax: number;
  connMin: number;
  connActual: number;
  
  getClient(): Promise<RedisClient>;
  putClient(clientId: string): void;

  removeClient(clientId: string): void;

  startMinConnections(): void;
  offLoadAll(): boolean;
  flushAndReStart(): void;
}

type ClientPool = {
  [clientId: string]: RedisClient;
}

export class RedisClientPool implements IRedisClientPool {
  connMax: number;
  connMin: number;
  connActual: number = 0;

  private clientOptions: IRedisClientOptions;

  public idleClients: string[] = [];
  // Here use the object/dictionary model instead of list, because of that
  // The working clients will be removed (when client returned) randomly. If
  // using list, we have to find the index first, but with using dictionary,
  // we can simply use `delete obj[k]` to remove the element.
  public workingClients: {
    [clientId: string]: number
  } = {};

  private pool: ClientPool = {};

  private CLEAN_INTERVAL_IN_SEC = 600;

  static CONN_MIN_MIN: number = 2;
  static CONN_MIN_MAX: number = 10;
  static CONN_MAX_DEFAULT: number = 10;

  constructor(options: IRedisClientPoolOptions = {}, autoStartMinConn?: boolean) {
    this.clientOptions = {
      host: options.host ?? "127.0.0.1",
      port: options.port ?? 6379,
      password: options.password,
      timeout: options.timeout,
      tls: options.tls,
    };
    this.connMin = options.connMin ?? RedisClientPool.CONN_MIN_MIN;
    this.connMin = this.connMin < RedisClientPool.CONN_MIN_MIN ? RedisClientPool.CONN_MIN_MIN : this.connMin;
    this.connMin = this.connMin > RedisClientPool.CONN_MIN_MAX ? RedisClientPool.CONN_MIN_MAX : this.connMin;
    this.connMax = options.connMax ?? RedisClientPool.CONN_MAX_DEFAULT;
    // The max connection count should be greater or eaqual to the min.
    this.connMax = this.connMax < this.connMin ? this.connMin : this.connMax;

    // Clean the pool periodically
    const cleanInterval = setInterval(() => {
        this.cleanPool();
      },
      this.CLEAN_INTERVAL_IN_SEC * 1000);

    // Start min connections if required
    if (autoStartMinConn) {
      this.startMinConnections();
    }
  }

  /**
   * Remove a client by specifying its Id.
   * @param clientId The id of the client that is going to be removed
   */
  public removeClient(clientId: string): void {
    // Remove the client, whenever the client is in idle queue or working queue    
    const idxInIdle = this.idleClients.indexOf(clientId);
    if (idxInIdle >= 0) {
      this.idleClients.splice(idxInIdle, 1);
    }
    delete this.workingClients[clientId];
    // Close the client before remove
    this.pool[clientId].close();
    // Delete the instance from pool.
    delete this.pool[clientId];
    this.connActual--;
    console.log(`Client with ID ${clientId} has been removed!`);
  }

  /**
   * Get an available client from the pool.
   * @returns Resolved if the client is available.
   */
  public getClient(): Promise<RedisClient> {
    if (this.idleClients.length > 0) {
      const cId = this.idleClients.shift() as string;
      this.workingClients[cId] = 1;
      return Promise.resolve(this.pool[cId]);
    } else if (this.connActual >= this.connMax) {
      return Promise.reject(`ERR: sorry, all ${this.connMax} Connections are all occupied, please consider raise the max connection limit!`)
    } else {
      return this.createConnection()
        .then(() => this.getClient());
    }
  }

  /**
   * Put back the client that is not going to be used, return it to pool, and make it idle.
   * @param clientId Id of the client that is returned back.
   */
  public putClient(clientId: string): void {
    if (this.workingClients[clientId]) {
      delete this.workingClients[clientId];
      if (this.idleClients.indexOf(clientId) < 0) {
        this.idleClients.push(clientId);
        console.log(`Client with ID ${clientId} has been returned!`);
      }
    } else {
      if (clientId in this.pool) {
        // In this case, the id is in pool, but not placed in working array, so it will be moved to idle array if it is not there.
        if (this.idleClients.indexOf(clientId) < 0) {
          this.idleClients.push(clientId);
          console.log(`Client with ID ${clientId} has been returned!`);
        }
      } else {
        // There might be something wrong, because the client should be in the pool, but it is not.
        // maybe the id passed in was wrong. in this case it will not be pushed to idle array, and if it was in,
        // then remove it, to keep buffers clean
        if (this.idleClients.includes(clientId)) {
          this.idleClients.splice(this.idleClients.indexOf(clientId), 1);
        }
      }
    }
  }

  // /**
  //  * Add one client using the default options.
  //  * @param cb_ready The callback of the client when it gets ready.
  //  */
  // private addConnection(cb_ready?: () => void) {
  //   const client = new RedisClient(this.clientOptions, true, true);
  //   // add the new client to pool, whatever what its state is
  //   this.pool[client.id] = client;
  //   this.connActual++;

  //   client.on("error", (err: Error) => {
  //     console.log(`Error happened: ${err.message}`);
  //     // Remove the client from pool
  //     this.removeClient(client.id);
  //   });
  //   client.on("close", (hadError: boolean) => {
  //     // Remove the client after the client is closed
  //     this.removeClient(client.id);
  //   });
  //   client.on("ready", () => {
  //     // Put the client into idle array if it is ready
  //     this.idleClients.push(client.id);
  //     console.log(`New client ready, id: ${client.id}`);
  //     if (cb_ready && typeof cb_ready === "function") {
  //       cb_ready();
  //     }
  //     // Set Timeout
  //     client.on("timeout", () => {
  //       if (this.idleClients.length > this.connMin) {
  //         this.removeClient(client.id);
  //       }
  //     })
  //   });
  // }

  /**
   * Create a new connection and ensure it is ready, return as Promise.
   * @returns The client in ready state
   */
  private createConnection(): Promise<RedisClient> {
    return new Promise((resolve, reject) => {
      // Create client, with auto-connect, ensure-ready and in-pool all enabled
      const client = new RedisClient(this.clientOptions, true, true, true);
      // Add the new client to pool, whatever what its state is
      this.pool[client.id] = client;
      this.connActual++;
      // Assign on-close hanlder
      client.on("close", (hadError: boolean) => {
        console.log(`Client ${client.id} has been closed!`);  
      });

      let clientReady: boolean = false;
      client.on("error", (err: Error) => {
        this.removeClient(client.id);
        if (!clientReady) {
          reject(`Error happened when creating the client!\n --> Detail: ${err.message}`);
        }});
      
      client.on("ready", () => {
        clientReady = true;
        // Push to idle set
        this.idleClients.push(client.id);
        client.on("timeout", () => {
          // When Idle timeout event happens, remove the client that is idle
          if (this.idleClients.length > this.connMin) {
            this.removeClient(client.id);
          }
        })
        resolve(client);
      });
    });
  }

  /**
   * Clean the pool periodically, if some client is neither in idle collection, nor in working collection, then remove it from the pool.
   */
  private cleanPool() {
    for (const cId in this.pool) {
      if (!this.idleClients.includes(cId) && !this.workingClients[cId]) {
        // Because there might be in case that the client is created, but not ready.
        // in this way, we are not going remove it, and it will be available in idle array and be ready after some tick.
        if (this.pool[cId].state !== RedisClient.states.CREATED) {
          delete this.pool[cId];
          this.connActual--;
        }
      }
    }
  }

  /**
   * Start connections to make sure actual connections are above the `min_conn`.
   */
  public startMinConnections(): void {
    if (this.connActual < this.connMin) {
      const connNeedToCreate = this.connMin - this.connActual;
      const newConns = [...Array(connNeedToCreate).keys()]
        .map(n => this.createConnection());
      Promise.allSettled(newConns)
        .then(res => {
          const failedNewConnection = res.filter(x => x.status === "rejected").length;
          if (failedNewConnection > 0) {
            console.log(`There are some ${failedNewConnection} connection(s) failed!`)
          }
        });
    }
  }

  /**
   * Offload, i.e. close and remove all the clients/connections
   * @returns If operation successful
   */
  public offLoadAll(): boolean {
    if (Object.keys(this.workingClients).length > 0) {
      console.log(`There are some clients still working! Could not offload all!`);
      return false;
    }
    for (let cId in this.pool) {
      this.removeClient(cId);
    }
    return true;
  }

  /**
   * Close all the clients and restart the min connections, to make a refresh.
   */
  public flushAndReStart(): void {
    if (this.offLoadAll()) {
      this.startMinConnections();
    } else {
      console.log(`Failed to flush and restart!`);
    }
  }

}