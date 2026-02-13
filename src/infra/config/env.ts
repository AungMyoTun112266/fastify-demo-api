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
});

export const env = envSchema.parse(process.env);
