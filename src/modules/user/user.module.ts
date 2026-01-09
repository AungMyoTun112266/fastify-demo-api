import { FastifyInstance } from "fastify";
import { AppContainer } from "../../container/container";
import { userRoutes } from "./user.route";
import { requireRole } from "../../plugins/require-role";

export async function userModule(
  app: FastifyInstance,
  container: AppContainer
) {
  await app.register(
    async (moduleApp) => {
      await moduleApp.register(requireRole("admin"));
      await userRoutes(moduleApp, container);
    },
    { prefix: "/users" }
  );
}
