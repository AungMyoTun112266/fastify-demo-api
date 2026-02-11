import { FastifyInstance } from "fastify";
import { AppContainer } from "../../container/container";
import { authRoutes } from "./auth.route";

export async function authModule(
  app: FastifyInstance,
  container: AppContainer
) {
  await app.register(
    async (moduleApp) => {
      await authRoutes(moduleApp, container);
    },
    { prefix: "/auth" }
  );
}
