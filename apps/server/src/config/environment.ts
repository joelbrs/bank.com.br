import "dotenv/config";
import { z } from "zod";

const environment_schema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_DB_NAME: z.string(),
  MONGO_URI: z.string(),
  HASH_SALT: z.coerce.number().default(12),
  JWT_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  API_BASE_URL: z.string(),
  AUTH_REDIRECT_URL: z.string(),
  NODE_ENV: z
    .enum(["development", "staging", "production", "test"])
    .default("production"),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string(),
});

const _env = environment_schema.safeParse(process.env);

if (!_env.success) {
  console.log("Invalid environments variables: ", _env.error?.format());
  throw new Error("Invalid environments variables");
}

export const env = _env.data;
