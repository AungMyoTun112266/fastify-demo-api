import { AuthUser } from "../shared/types/auth";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}
