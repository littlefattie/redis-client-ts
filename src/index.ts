import RespProtocol from "./protocol";
import RedisCommands from "./commands";

import { IRedisClientOptions, RedisClient } from "./client";
import { RedisClientPool } from "./pool";


const createClient = (options?: IRedisClientOptions, ensureReady?:boolean): Promise<RedisClient> => {
  return ensureReady
    ? new Promise((resolve, reject) => {
        const client = new RedisClient(options, true, true);
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


/**
 * This is the default exported client, it is just instanetiated, without connection, and the socket is not connected.
 * If want to use this this, please `connect` and make sure `it is ready` manually, you need to use the method of 'client.copyOptions()`
 * to set your customized options, use `client.connect()` to connect to server, and use `client.isReady()` to check if the client is ready
 * to send and receive commands.
 * OR you can use the function of `createClient`, and make some wrapper for it. e.g.
 * -- File: myClient.ts
 * const client: RedisClient;
 * createClient(opitons, true).then(c => client = c);
 * 
 * export default client;
 * 
 * -- File: moduleA.ts
 * import redis from "myClient.ts"
 * 
 * -- File: moduleB.ts
 * import redis from "myClient.ts"
 */
export default new RedisClient();