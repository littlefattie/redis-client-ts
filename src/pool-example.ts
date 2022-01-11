import { RedisClientPool } from ".";
import { IRedisClientPoolOptions } from "./pool";

const poolOpts: IRedisClientPoolOptions = {
  host: "127.0.0.1",
  port: 6379,
  connMin: 4,
  connMax: 15,
};

export default new RedisClientPool(poolOpts, true);