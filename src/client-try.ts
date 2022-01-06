import { IRedisClientOptions, RedisClient } from "./client";
import redisCommands from "./commands";

const createCleint:((options: IRedisClientOptions) => Promise<RedisClient>) = (options: IRedisClientOptions) => {
  return new Promise((resolve, reject) => {
    const client = new RedisClient(options);
    client.on("error", (err:Error) => {
      reject(`Error happened when creating the client!\nDetail: ${err.message}`);
    });
    client.on("ready", () => {
      console.log(`The client is ready, ID: ${client.id}`);
      resolve(client);
    });
  })
}

const options: IRedisClientOptions = {
    host: '128.9.9.9',
    port: 6379,
  };

createCleint(options)
  .then((client) => {
    client.rawCommand(...redisCommands.generic.KEYS, "*")
      .then(answer => {
        console.log(answer[0]);
      })
      .then(() => client.close());
  })
  .catch(err => {
    console.log(err);
    console.log("error happened");
  });

