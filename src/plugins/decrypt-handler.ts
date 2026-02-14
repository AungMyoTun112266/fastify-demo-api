import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { preventReplay } from "../infra/security/replay-protection";
import { BadRequestError, UnsupportedMediaTypeError } from "../shared/errors";
import { decryptData } from "../shared/utils/crypto";
import {
  encryptedBodySchema,
  EncryptedPayload,
} from "../shared/validators/encrypted-payload";
import { validate } from "../shared/utils/validate";

const methodsWithBody = ["POST", "PUT", "PATCH"];
export const decryptPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.addHook("preValidation", async (request) => {
    if (!methodsWithBody.includes(request.method)) {
      return;
    }
    const contentType = request.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new UnsupportedMediaTypeError(
        "Content-Type must be application/json"
      );
    }
    const nonce = request.headers["x-nonce"] as string;

    if (!nonce) {
      throw new BadRequestError("Missing required headers: x-nonce");
    }
    const body = validate(encryptedBodySchema, request.body);
    const payload: EncryptedPayload = {
      ...body,
      nonce,
    };

    await preventReplay(nonce);
    const decrypted = decryptData(payload);
    request.body = decrypted;
  });
});
