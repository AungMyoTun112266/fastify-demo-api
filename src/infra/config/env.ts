import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  AWS_REGION: z.string().default("ap-northeast-1"),

  USERS_TABLE: z.string().min(1, "USERS_TABLE is required"),
  PRODUCTS_TABLE: z.string().min(1, "PRODUCTS_TABLE is required"),

  COGNITO_USER_POOL_ID: z.string().min(1, "COGNITO_USER_POOL_ID is required"),
  COGNITO_CLIENT_ID: z.string().min(1, "COGNITO_CLIENT_ID is required"),
  AES_SECRET_KEY: z
    .string()
    .refine(
      (val) => Buffer.from(val, "base64").length === 32,
      "AES_SECRET_KEY must decode to exactly 32 bytes"
    ),

  HMAC_SECRET_KEY: z
    .string()
    .refine(
      (val) => Buffer.from(val, "base64").length >= 32,
      "HMAC_SECRET_KEY must decode to at least 32 bytes"
    ),
  DYNAMO_HMAC_TABLE: z.string().min(1, "DYNAMO_HMAC_TABLE is required"),
});

export const env = envSchema.parse(process.env);
