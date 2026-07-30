import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";
import { InternalServerError } from "../utils/appError.utils.js";
import logger from "@app/logger";
import { backendEnv } from "./env.config.js";

let redisCheckpointer: RedisSaver | null = null;
let initPromise: Promise<RedisSaver> | null = null;

const initCheckpointer = async (): Promise<RedisSaver> => {
  if (redisCheckpointer) return redisCheckpointer;
  try {
    redisCheckpointer = await RedisSaver.fromUrl(backendEnv.REDIS_URL, {
      defaultTTL: 30 * 60 * 24,
      refreshOnRead: false,
    });
    return redisCheckpointer;
  } catch (error) {
    logger.info({ message: "Failed to connect with Redis", error });
    throw new InternalServerError("Error occured while connecting to Redis");
  }
};

// Start initialization eagerly at module load
initPromise = initCheckpointer();

export const getRedisCheckpointer = async (): Promise<RedisSaver> => {
  if (redisCheckpointer) return redisCheckpointer;
  if (initPromise) return initPromise;
  return initCheckpointer();
};
