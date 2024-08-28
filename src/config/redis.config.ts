import { redisClient } from "../utils/redis.client";

export const connectRedisClient = async () => {
  try {
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    redisClient.on("connect", () => console.log("Redis connected"));

    await redisClient.connect();

  } catch (error) {
    console.error("Redis Connection Error: ",JSON.stringify(error))
    process.exit(1);  
  }
};
