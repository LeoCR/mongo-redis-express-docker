import * as redis from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

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
