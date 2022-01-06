import { IRedisClientOptions, RedisClient } from "./client";
import redisCommands from "./commands";
import protocol from "./protocol";

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
    host: 'localhost',
    port: 6379,
  };

// let t1 = 0, t2 = 0;

createCleint(options)
  .then((client) => {
    client.rawCommand(...redisCommands.generic.KEYS, "*")
      .then(answer => {
        console.log(answer[0]);
        console.log(protocol.translateResult(answer));
      })
      .then(() => {
        // t1 = new Date().getTime();
        return client.commandsInPipeline([
          ["incr", "c1"],
          ["incr", "c1"],
          ["incr", "c1"],
        ])
      })
      .then(x => {
        // t2 = new Date().getTime();
        // console.log(`RTT is ${t2 - t1} ms!`)
        console.log(x);
      })
      .then(() => client.rawCommandInPipeLine([
          ["incr", "c1"],
          ["incr", "c1"],
          ["incr", "c1"],        
      ]))
      .then(x => console.log(x))
      .then(() => client.singleCommand("incr", "c1", "15"))
      .catch(err => {
        console.log(err);
      })
      .finally(() => client.close());
  })
  .catch(err => {
    console.log(err);
    console.log("error happened");
  });

