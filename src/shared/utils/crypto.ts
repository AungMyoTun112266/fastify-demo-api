import crypto from "crypto";
import { env } from "../../infra/config/env";
import { ForbiddenError } from "../errors";
import {
  EncryptedPayload,
  EncryptedBody,
} from "../validators/encrypted-payload";

export function encryptData(payload: unknown): EncryptedPayload {
  const iv = crypto.randomBytes(12); // 12 for GCM
  const nonce = crypto.randomUUID();

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(env.AES_SECRET_KEY, "base64"),
    iv
  );
  cipher.setAAD(Buffer.from(nonce));
  const encrypted =
    cipher.update(JSON.stringify(payload), "utf8", "base64") +
    cipher.final("base64");

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted,
    nonce: nonce,
  };
}

export function decryptData(body: EncryptedPayload) {
  const { iv, tag, data, nonce } = body;
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(env.AES_SECRET_KEY, "base64"),
      Buffer.from(iv, "base64")
    );
    decipher.setAAD(Buffer.from(nonce));
    decipher.setAuthTag(Buffer.from(tag, "base64"));

    const decrypted =
      decipher.update(data, "base64", "utf8") + decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch {
    throw new ForbiddenError("Encrypted payload integrity check failed.");
  }
}

export function generateSignature(
  nonce: string,
  iv: string,
  data: string,
  tag: string
): string {
  const message = `${nonce}.${iv}.${data}.${tag}`;

  return crypto
    .createHmac("sha256", Buffer.from(env.HMAC_SECRET_KEY, "base64"))
    .update(message)
    .digest("hex");
}
