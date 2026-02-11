import { z } from "zod";
import { email, password, requiredString } from "../../shared/validators/string";
import { positiveInt } from "../../shared/validators/number";

export const signupBodySchema = z.object({
  email: email("Email"),
  name: requiredString("Name", { max: 100 }),
  age: positiveInt("Age"),
  password: password("Password"),
});

export const signinBodySchema = z.object({
  email: email("Email"),
  password: password("Password"),
});

export const signupResponseSchema = z.object({
  message: z.string(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  idToken: z.string(),
  refreshToken: z.string(),
});

export type SignupBody = z.infer<typeof signupBodySchema>;
export type SigninBody = z.infer<typeof signinBodySchema>;
