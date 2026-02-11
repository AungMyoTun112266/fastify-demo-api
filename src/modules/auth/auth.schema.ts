import { z } from "zod";
import { requiredString } from "../../shared/validators/string";
import { positiveInt } from "../../shared/validators/number";

export const signupBodySchema = z.object({
  email: requiredString("Email").email({ message: "Email must be valid" }),
  name: requiredString("Name"),
  age: positiveInt("Age"),
  password: requiredString("Password").min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const signinBodySchema = z.object({
  email: requiredString("Email").email({ message: "Email must be valid" }),
  password: requiredString("Password"),
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
