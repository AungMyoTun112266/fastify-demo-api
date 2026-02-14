import { z } from "zod";
import { ValidationError } from "../errors";

export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const flat = result.error.flatten();
    const formatted: Record<string, string> = {};

    for (const key in flat.fieldErrors) {
      const firstError = flat.fieldErrors[key]?.[0];
      if (firstError) {
        formatted[key] = firstError;
      }
    }

    throw new ValidationError(formatted);
  }

  return result.data;
}
