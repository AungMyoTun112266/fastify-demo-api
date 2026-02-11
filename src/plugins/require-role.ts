import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../shared/errors";

const ROLE_HIERARCHY: Record<string, string[]> = {
  admin: ["admin", "user"],
  user: ["user"],
};

export const requireRole = (role: "user" | "admin"): FastifyPluginAsync =>
  fp(async (app) => {
    app.addHook("preHandler", async (request) => {
      if (!request.user) {
        throw new UnauthorizedError();
      }

      const allowedRoles = ROLE_HIERARCHY[request.user.role] ?? [];
      if (!allowedRoles.includes(role)) {
        throw new ForbiddenError();
      }
    });
  });
