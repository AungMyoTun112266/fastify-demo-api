import { z } from "zod";

export const encryptedPayloadSchema = z.object({
  iv: z.string().min(1),
  tag: z.string().min(1),
  data: z.string().min(1),
  nonce: z.uuid(),
});

export type EncryptedPayload = z.infer<typeof encryptedPayloadSchema>;
