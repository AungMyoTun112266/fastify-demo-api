import crypto from "crypto";
import { env } from "../../infra/config/env";
import { ForbiddenError } from "../errors";
import {
  EncryptedPayload,
  EncryptedBody,
} from "../validators/encrypted-payload";

const AES_ALGO = "aes-256-gcm";
const HMAC_ALGO = "sha256";
const IV_LENGTH = 12; // 96-bit for GCM
const AUTH_TAG_LENGTH = 16;

const AES_KEY = Buffer.from(env.AES_SECRET_KEY, "base64");
const HMAC_KEY = Buffer.from(env.HMAC_SECRET_KEY, "base64");

if (AES_KEY.length !== 32) {
  throw new Error("AES_SECRET_KEY must be 32 bytes (256-bit)");
}

if (HMAC_KEY.length < 32) {
  throw new Error("HMAC_SECRET_KEY must be at least 32 bytes");
}

export function encryptData(payload: unknown): EncryptedPayload {
  const iv = crypto.randomBytes(IV_LENGTH);
  const nonce = crypto.randomBytes(16).toString("base64");

  const cipher = crypto.createCipheriv(AES_ALGO, AES_KEY, iv);
  cipher.setAAD(Buffer.from(nonce));
  cipher.setAutoPadding(true);

  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");

  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  const tag = cipher.getAuthTag();

  const result: EncryptedPayload = {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
    nonce: nonce,
  };
  result.signature = generateSignature(result);
  return result;
}

export function decryptData(body: EncryptedPayload) {
  try {
    validateEncryptedPayload(body);
    verifySignature(body);

    const iv = Buffer.from(body.iv, "base64");
    const tag = Buffer.from(body.tag, "base64");
    const encrypted = Buffer.from(body.data, "base64");

    if (iv.length !== IV_LENGTH) {
      throw new ForbiddenError("Invalid IV length");
    }

    if (tag.length !== AUTH_TAG_LENGTH) {
      throw new ForbiddenError("Invalid auth tag length");
    }
    const decipher = crypto.createDecipheriv(AES_ALGO, AES_KEY, iv);

    decipher.setAAD(Buffer.from(body.nonce));
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString("utf8"));
  } catch {
    throw new ForbiddenError("Encrypted payload integrity check failed.");
  }
}

function generateSignature(payload: EncryptedPayload): string {
  const message = buildMessageBuffer(payload);

  return crypto.createHmac(HMAC_ALGO, HMAC_KEY).update(message).digest("hex");
}

function verifySignature(payload: EncryptedPayload) {
  if (!payload.signature) {
    throw new ForbiddenError("Missing signature");
  }

  const expected = generateSignature(payload);

  const isValid = crypto.timingSafeEqual(
    Buffer.from(payload.signature, "hex"),
    Buffer.from(expected, "hex")
  );

  if (!isValid) {
    throw new ForbiddenError("Invalid signature");
  }
}

function buildMessageBuffer(payload: EncryptedPayload): Buffer {
  return Buffer.concat([
    Buffer.from(payload.nonce),
    Buffer.from(payload.iv),
    Buffer.from(payload.data),
    Buffer.from(payload.tag),
  ]);
}
function validateEncryptedPayload(payload: EncryptedPayload) {
  if (!payload.iv || !payload.tag || !payload.data || !payload.nonce) {
    throw new ForbiddenError("Malformed encrypted payload");
  }
}
