// import protocol, { RespResponse } from "../protocol";
import {IRedisClientOptions, RedisClient} from "../client";
import redisCommands from "../commands";

describe("Test the client", () => {

  let options: IRedisClientOptions;
  let client: RedisClient;
  
  jest.setTimeout(100000);

  beforeAll(() => {
    options  = {
      host: 'localhost',
      port: 6379,
    }
    client = new RedisClient(options);
    client.on("ready", () => {
      console.log("The client is ready!");
      console.log(client.id);
    });

  })

  it("Test RAW command", async () => {
    // if (client.state === RedisClient.states.READY) {
      await client.rawCommand(...redisCommands.generic.KEYS, "*")
        .then(answer => {
          console.log(answer[0]);
        })
    // }
  });
  
  afterAll(() => {
    // Close the client after testing.
    client.close();
  });

})