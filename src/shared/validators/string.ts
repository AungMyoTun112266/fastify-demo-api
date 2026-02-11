import { z } from "zod";

interface StringOptions {
  min?: number;
  max?: number;
}

/**
 * Required non-empty string, trimmed. Default max 255.
 */
export const requiredString = (field: string, opts?: StringOptions) => {
  const min = opts?.min ?? 1;
  const max = opts?.max ?? 255;

  return z
    .string({ error: `${field} is required` })
    .trim()
    .min(min, { message: `${field} cannot be empty` })
    .max(max, { message: `${field} must be at most ${max} characters` });
};

/**
 * Optional string, trimmed when present. Returns undefined if omitted.
 */
export const optionalString = (field: string, opts?: StringOptions) => {
  let schema = z.string().trim();

  if (opts?.min) {
    schema = schema.min(opts.min, {
      message: `${field} must be at least ${opts.min} characters`,
    });
  }

  const max = opts?.max ?? 255;
  schema = schema.max(max, {
    message: `${field} must be at most ${max} characters`,
  });

  return schema.optional();
};

/**
 * Email: required, trimmed, lowercased, RFC-valid. Max 254 (RFC 5321).
 * Uses z.string() chain so trim/lowercase apply before format validation.
 */
export const email = (field: string) =>
  z
    .string({ error: `${field} is required` })
    .trim()
    .toLowerCase()
    .email({ message: `${field} must be a valid email address` })
    .max(254, { message: `${field} must be at most 254 characters` });

/**
 * Password: required, NOT trimmed (spaces are intentional). Default min 8, max 128.
 */
export const password = (field: string, opts?: StringOptions) => {
  const min = opts?.min ?? 8;
  const max = opts?.max ?? 128;

  return z
    .string({ error: `${field} is required` })
    .min(min, {
      message: `${field} must be at least ${min} characters`,
    })
    .max(max, {
      message: `${field} must be at most ${max} characters`,
    });
};

/**
 * Identifier: for IDs, slugs, keys. Trimmed, max 255.
 */
export const identifier = (field: string, opts?: StringOptions) => {
  const max = opts?.max ?? 255;

  return z
    .string({ error: `${field} is required` })
    .trim()
    .min(1, { message: `${field} cannot be empty` })
    .max(max, { message: `${field} must be at most ${max} characters` });
};

/**
 * URL: required, valid URL format. Max 2048.
 */
export const url = (field: string) =>
  z
    .url({ message: `${field} must be a valid URL` })
    .max(2048, { message: `${field} must be at most 2048 characters` });

/**
 * Long text: for descriptions, comments. Trimmed, default max 5000.
 */
export const longText = (field: string, opts?: StringOptions) => {
  const min = opts?.min ?? 1;
  const max = opts?.max ?? 5000;

  return z
    .string({ error: `${field} is required` })
    .trim()
    .min(min, { message: `${field} cannot be empty` })
    .max(max, { message: `${field} must be at most ${max} characters` });
};

/**
 * Query string boolean: accepts "true"/"false" strings, transforms to boolean.
 */
export const strictBoolean = (field: string) =>
  z
    .enum(["true", "false"], {
      message: `${field} must be true or false`,
    })
    .transform((v) => v === "true");
