import Fastify from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userModule } from "./modules/user/user.module";
import { createContainer } from "./container/container";
import { errorHandler } from "./plugins/error-handler";
import { authPlugin } from "./plugins/auth";

export function buildApp() {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  const container = createContainer();
  errorHandler(app);
  app.register(authPlugin);
  userModule(app, container);
  return app;
}

export type AppInstance = ReturnType<typeof buildApp>;
