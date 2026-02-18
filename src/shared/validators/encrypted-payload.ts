import { z } from "zod";

export const encryptedBodySchema = z.object({
  iv: z.string().min(1),
  tag: z.string().min(1),
  data: z.string().min(1),
});

export const encryptedPayloadSchema = encryptedBodySchema.extend({
  nonce: z.uuid(),
  signature: z.string().optional(),
});

export type EncryptedBody = z.infer<typeof encryptedBodySchema>;
export type EncryptedPayload = z.infer<typeof encryptedPayloadSchema>;
