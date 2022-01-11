import { createClient, RedisClient } from ".";
import { IRedisClientOptions } from "./client";

const clientOpts: IRedisClientOptions = {
  host: '127.0.0.1',
  port: 6379,
};

let client: RedisClient | undefined;

createClient(clientOpts, true)
  .then(c => {
    client = c;
  })
  .catch(err => {
    console.log(`Redis client creation failed! Error Detail: ${err}`);
    // Exit if Redis is not able to be ready.
    process.exit(1);
  });
  
export default client;
