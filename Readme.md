# redis-client-ts

A redis client written in Typescript, with pooling implemented, and encapsulated intuitive methods like `setCounter`, `getCounter`, `setObject`, `getObject`, `setList`, `getList` etc.

## Installation

Use this command to install:
```shell
npm install @littlefattie/redis-client-ts
```
## Redis Commands

This package provides a full list for the Redis commands, presented in string array (`string[]`). Use this code to import:
```ts
import { RedisCommands } from "@littlefattie/redis-client-ts";
// This will print  ["CLIENT", "GETNAME"]
console.log(RedisCommands.CLIENT_GETNAME);

// This will print ["MSET"]
console.log(RedisCommands.MSET);
```

The commands also are provided in categories, you can access by importing another name:
```ts
import { redisCommandsInCategory } from "@littlefattie/redis-client-ts/dist/commands";
// This will print  ["CLIENT", "GETNAME"]
console.log(redisCommandsInCategory.connection.CLIENT_GETNAME);

// This will print ["MSET"]
console.log(redisCommandsInCategory.string.MSET);
```

The script of generating the commands is also provided as a tool, please find it at `${packageroot}/tools/get-commands-from-redis-io.js`

In your package, you can run 

```shell
node ./node_modules/@littlefattie/redis-client-ts/tools/get-commands-from-redis-io.js
```
to generate a new commands list from `https://redis.io`, the file will be saved to `src/commands.ts` to your package.

## Usage - Client

By default, the import action of this package will generate a client, but it is not initialized, well configured, connected, or tested. You can do it like this:
```ts
import client from "@littlefattie/redis-client-ts"
```
and you need to manually configure it to make it ready, like this:
```ts
// Load your customized options
client.copyOptions(options);
// Connect manually, here if you specify the options, then copyOptions could be omitted
client.connect(options, true);
// Test connection by sending `PING` command to server
client.testConnection();
// Auth the connection if needed
client.auth(password, username);
// Check if the client is ready
client.isReady();
```

This is flexible and maybe some kind of too complicated, then you can write some wrapper and use the provided `createClient` function to get a Promise of the client.

### Make client wrapper

One example of the wrapper could be:
```typescript
// File RedisClient.ts (wrapper module)
import { createClient, RedisClient } from ".";
import { IRedisClientOptions } from "./client";

const clientOpts: IRedisClientOptions = {
  host: '127.0.0.1',
  port: 6379,
  // More options if required
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

// ModuleA.ts
import redis from "RedisClient.ts"
// this if-undefined check could be omitted because in normal case, it need to be always not undefined, or the process has exited.
if (redis) {
  redis.set("KeyTest", "Hello World!")
    .then(() => redis.get("KeyTest"))
    .then(val => console.log(val));
}

// ModuleB.ts
import redis from "RedisClient.ts"

redis.set("KK", "I am the King!")
  .then(() => console.log("Yes, you are the King!"));
```

With this implementation, you will get the ready client if the promise `Resolved`.

And surely without any wrapper, you are free to use the `createClient` function to make your own clients, and you use it in a make-use-destroy way. Like this:

```ts
createClient({}, true)
  .then(client => client.set("KK", "King is King!")
    .then(() => client.get("KK"))
    .then(val => console.log(val))
    .then(() => client.close())
    .finally(() => {
      client.close();
      client = undefined;
    })
  );
```

## Usage - Pooling

Pooling is simple, you can create a pool with basic options, and export it, in other modules, you can import the pool and use it directly.

For example:
```ts
// pool.ts
import { RedisClientPool } from ".";
import { IRedisClientPoolOptions } from "./pool";

const poolOpts: IRedisClientPoolOptions = {
  host: "127.0.0.1",
  port: 6379,
  connMin: 4,
  connMax: 15,
};

export default new RedisClientPool(poolOpts, true);

// moduleA.ts
import pool from "pool.ts"
pool.getClient()
  .then(client => client.get("KK")
    .then(val => console.log(val))
    .then(() => pool.putClient(client.id))
  );

// moduleB.ts
import pool from "pool.ts"
const client = await pool.getClient();
const val = client.get("KK");
console.log(val);
pool.putClient(client.id);  
```

And please remember to return (`putClient()`) the client when you have finished the client usage.

## Client methods

- For normal usage, please use the command of `client.singleCommand(...cmdArray)` for **Single Command**, or `client.commandsInPipeline([cmdArray])` to execute multiple commands in pipeline, both commands will return results in promise.

- And you can use `rawCommand` and `rawCommandInPipeLine` to get the **RAW** results of the command, which have the structure of redis **RESP protocol**, plainly parsed from Redis response. And there is a `translate` function in the **protocol** module to translate the **RAW results** to human-readable results.
  
- All the quick commands defined, like `setObject`, `getObject`, `setList`, `getList`, etc are wrappers for specific commands, you can do it in your favorite customized way. Not all the redis commands are encapsulated in this way. You can override current existing and/or add others you need.

## Notes
 - The typescript source is also included in the package, please examine it at `${packageRoot}/src/` for why and debugging.
 - To check the whole dev package, please go to [`https://github.com/littlefattie/redis-client-ts`](https://github.com/littlefattie/redis-client-ts)

