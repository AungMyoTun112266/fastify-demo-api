import { z } from "zod";

export const requiredString = (field: string) =>
  z
    .string({ error: `${field} is required` })
    .min(1, { message: `${field} cannot be empty` });

export const strictBoolean = (field: string) =>
  z
    .enum(["true", "false"], {
      message: `${field} must be true or false`,
    })
    .transform((v) => v === "true");
