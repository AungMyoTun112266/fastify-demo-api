import { z } from "zod";
import { requiredString, strictBoolean } from "../../shared/validators/string";
import { positiveInt } from "../../shared/validators/number";

export const userParamsSchema = z.object({
  id: requiredString("User id"),
});

export const userQuerySchema = z.object({
  active: strictBoolean("active"),
});

export const userBodySchema = z.object({
  name: requiredString("Name"),
  age: positiveInt("Age"),
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
