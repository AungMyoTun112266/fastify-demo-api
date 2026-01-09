import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  AWS_REGION: z.string().default("ap-northeast-1"),

  // USERS_TABLE: z.string().min(1, "USERS_TABLE is required"),
  USERS_TABLE: z.string().default("test_user"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  AWS_REGION: process.env.AWS_REGION,
  USERS_TABLE: process.env.USERS_TABLE,
});
