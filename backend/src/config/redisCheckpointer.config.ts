import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";
import { InternalServerError } from "../utils/appError.utils.js";
import logger from "../utils/logger.utils.js";

let redisCheckpointer: RedisSaver;

export const getRedisCheckpointer = async () => {
  if (!redisCheckpointer) {
    try {
      redisCheckpointer = await RedisSaver.fromUrl(process.env.REDIS_URL as string, {
        defaultTTL: 30 * 60 * 24,
        refreshOnRead: false,
      });
    } catch (error) {
      logger.info({ message: "Failed to connect with Redis", error });
      throw new InternalServerError("Error occured while connecting to Redis");
    }
  }
  return redisCheckpointer;
};

export default await getRedisCheckpointer();
