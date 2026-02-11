import { z } from "zod";
import { identifier, requiredString, password, strictBoolean } from "../../shared/validators/string";
import { positiveInt } from "../../shared/validators/number";

export const userParamsSchema = z.object({
  id: identifier("User id"),
});

export const userQuerySchema = z.object({
  active: strictBoolean("active"),
});

export const userBodySchema = z.object({
  name: requiredString("Name", { max: 100 }),
  age: positiveInt("Age"),
  password: password("Password"),
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
});

export type UserParams = z.infer<typeof userParamsSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type UserBody = z.infer<typeof userBodySchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
