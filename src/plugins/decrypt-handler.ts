import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { preventReplay } from "../infra/security/replay-protection";
import { UnsupportedMediaTypeError } from "../shared/errors";
import { decryptData } from "../shared/utils/crypto";
import { encryptedPayloadSchema } from "../shared/validators/encrypted-payload";
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
    const body = validate(encryptedPayloadSchema, request.body);
    const decrypted = decryptData(body);
    await preventReplay(body.nonce);
    request.body = decrypted;
  });
});
