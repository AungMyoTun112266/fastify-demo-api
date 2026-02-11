import { FastifyInstance } from "fastify";
import { AppContainer } from "../../container/container";
import { productRoutes } from "./product.route";
import { requireRole } from "../../plugins/require-role";

export async function productModule(
  app: FastifyInstance,
  container: AppContainer
) {
  await app.register(
    async (moduleApp) => {
      await moduleApp.register(requireRole("user"));
      await productRoutes(moduleApp, container);
    },
    { prefix: "/products" }
  );
}
