import { IRedisClientOptions, RedisClient } from "./client";
import redisCommands from "./commands";
import protocol from "./protocol";

const createCleint:((options: IRedisClientOptions) => Promise<RedisClient>) = (options: IRedisClientOptions) => {
  return new Promise((resolve, reject) => {
    const client = new RedisClient(options, true, true);
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

const c1 = new RedisClient(options);
const makeC1Ready = () => {
  return c1.isReady()
    .catch(msg => {
      console.log(msg);
      c1.connect(options, true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          c1.isReady()
            .then(() => resolve(true))
            .catch(() => reject("Make ready failed!"));
        }, 300);
      })
    });
}

makeC1Ready()
 .then(() => c1.testConnection())
 .then(() => c1.singleCommand(...redisCommands.KEYS, "*"))
 .then(res => console.log(res))
 .then(() => c1.singleCommand(...redisCommands.INCR, "c1"))
 .then((cntr) => console.log(cntr))
 .then(() => c1.incr("c1"))
 .then((cntr) => console.log(cntr))
 .catch(msg => console.log(msg))
 .finally(() => c1.close());



// let t1 = 0, t2 = 0;

// createCleint(options)
//   .then((client) => {
//     client.rawCommand(...redisCommands.KEYS, "*")
//       .then(answer => {
//         console.log(answer[0]);
//         console.log(protocol.translateResult(answer));
//       })
//       .then(() => {
//         // t1 = new Date().getTime();
//         return client.commandsInPipeline([
//           ["incr", "c1"],
//           ["incr", "c1"],
//           ["incr", "c1"],
//         ])
//       })
//       .then(x => {
//         // t2 = new Date().getTime();
//         // console.log(`RTT is ${t2 - t1} ms!`)
//         console.log(x);
//       })
//       .then(() => client.rawCommandInPipeLine([
//           ["incr", "c1"],
//           ["incr", "c1"],
//           ["incr", "c1"],        
//       ]))
//       .then(x => console.log(x))
//       .then(() => client.singleCommand("incr", "c1", "15"))
//       .catch(err => {
//         console.log(err);
//       })
//       .finally(() => client.close());
//   })
//   .catch(err => {
//     console.log(err);
//     console.log("error happened");
//   });

