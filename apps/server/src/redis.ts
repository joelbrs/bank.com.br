import { Redis } from "ioredis";
import { env } from "./config";

export const redis = new Redis({
  username: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  port: env.REDIS_PORT,
});
