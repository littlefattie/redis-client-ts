import RespProtocol from "./protocol";
import RedisCommands from "./commands";

import { IRedisClientOptions, RedisClient } from "./client";
import { RedisClientPool } from "./pool";


const createClient = (options?: IRedisClientOptions, ensureReady?:boolean): Promise<RedisClient> => {
  return ensureReady
    ? new Promise((resolve, reject) => {
        const client = new RedisClient(options);
        client.on("error", (err:Error) => {
          reject(`Error happened when creating the client!\n --> Detail: ${err.message}`);
        });
        client.on("ready", () => {
          console.log(`The client is ready, ID: ${client.id}`);
          resolve(client);
        });
      })
    : Promise.resolve(new RedisClient(options));
}



export {
  createClient,
  RedisClient,
  RedisClientPool,
  RespProtocol,
  RedisCommands,
}


export default new RedisClient();