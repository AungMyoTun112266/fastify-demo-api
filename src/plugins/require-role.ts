import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../shared/errors";

export const requireRole = (role: "user" | "admin"): FastifyPluginAsync =>
  fp(async (app) => {
    app.addHook("preHandler", async (request) => {
      if (!request.user) {
        throw new UnauthorizedError();
      }

      if (request.user.role !== role) {
        throw new ForbiddenError();
      }
    });
  });
