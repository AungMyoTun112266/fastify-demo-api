import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { UnauthorizedError } from "../shared/errors";

const PUBLIC_ROUTES = ["/auth/register", "/auth/forgot-password"];

export const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateRequest("user", undefined);

  fastify.addHook("preHandler", async (request, reply) => {
    if (PUBLIC_ROUTES.includes(request.url!)) {
      return;
    }
    const auth = request.headers.authorization;
    if (!auth) {
      throw new UnauthorizedError();
    }

    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || token !== "valid-token") {
      throw new UnauthorizedError("Invalid token");
    }

    request.user = {
      id: "user-123",
      role: "admin",
    };
  });
});
