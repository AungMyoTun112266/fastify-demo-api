import crypto from "crypto";
import { env } from "../../infra/config/env";
import { BadRequestError, ForbiddenError } from "../errors";
import { EncryptedPayload } from "../validators/encrypted-payload";

export function encryptData(payload: unknown): EncryptedPayload {
  const iv = crypto.randomBytes(12); // 12 for GCM
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(env.AES_SECRET_KEY, "base64"),
    iv
  );

  const encrypted =
    cipher.update(JSON.stringify(payload), "utf8", "base64") +
    cipher.final("base64");

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted,
    nonce: crypto.randomUUID(),
  };
}

export function decryptData(body: EncryptedPayload) {
  const { iv, tag, data } = body;
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(env.AES_SECRET_KEY, "base64"),
      Buffer.from(iv, "base64")
    );

    decipher.setAuthTag(Buffer.from(tag, "base64"));

    const decrypted =
      decipher.update(data, "base64", "utf8") + decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch {
    throw new ForbiddenError("Encrypted payload integrity check failed.");
  }
}
