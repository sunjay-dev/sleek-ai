import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";
import { logger } from "../utils/logger.utils.js";

let redisCheckpointer: RedisSaver;

export const getRedisCheckpointer = async () => {
  if (!redisCheckpointer) {
    try {
      redisCheckpointer = await RedisSaver.fromUrl(process.env.REDIS_URL!, {
        defaultTTL: 60 * 60,
        refreshOnRead: false,
      });
    } catch (err) {
      logger.error("Failed to connect to Redis", err);
      throw err;
    }
  }
  return redisCheckpointer;
};

export default await getRedisCheckpointer();
