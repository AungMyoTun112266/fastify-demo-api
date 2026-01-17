import Fastify from "fastify";
import compress from "@fastify/compress";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userModule } from "./modules/user/user.module";
import { createContainer } from "./container/container";
import { errorHandler } from "./plugins/error-handler";
import { authPlugin } from "./plugins/auth";

export function buildApp() {
  const app = Fastify({
    logger: false,
    trustProxy: true,
  }).withTypeProvider<ZodTypeProvider>();
  const container = createContainer();
  app.register(compress, {
    global: true,
    encodings: ["gzip", "br"], // Brotli + gzip
    threshold: 1024, // compress responses > 1KB
  });
  errorHandler(app);
  app.register(authPlugin);
  userModule(app, container);
  return app;
}

export type AppInstance = ReturnType<typeof buildApp>;
