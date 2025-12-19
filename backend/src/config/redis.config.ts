// import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";
// import { InternalServerError } from "../utils/appError.utils.js";

// let redisCheckpointer: RedisSaver;

// export const getRedisCheckpointer = async () => {
//   if (!redisCheckpointer) {
//     try {
//       redisCheckpointer = await RedisSaver.fromUrl(process.env.REDIS_URL!, {
//         defaultTTL: 60 * 60,
//         refreshOnRead: false,
//       });
//     } catch {
//       throw new InternalServerError("Error occured while connecting to Redis");
//     }
//   }
//   return redisCheckpointer;
// };

// export default await getRedisCheckpointer();
