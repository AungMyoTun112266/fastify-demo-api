import Fastify from "fastify";
import formbody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userModule } from "./modules/user/user.module";
import { productModule } from "./modules/product/product.module";
import { authModule } from "./modules/auth/auth.module";
import { createContainer } from "./container/container";
import { errorHandler } from "./plugins/error-handler";
import { authPlugin } from "./plugins/auth-handler";
import { zodPlugin } from "./plugins/zod";
import { decryptPlugin } from "./plugins/decrypt-handler";

export function buildApp() {
  const app = Fastify({
    logger: false,
    trustProxy: true,
    bodyLimit: 10 * 1024 * 1024, // 10MB
  }).withTypeProvider<ZodTypeProvider>();
  app.register(helmet);
  app.register(formbody);

  zodPlugin(app);
  const container = createContainer();

  app.register(compress, {
    global: true,
    encodings: ["gzip", "br"], // Brotli + gzip
    threshold: 1024, // compress responses > 1KB
  });
  errorHandler(app);
  app.register(decryptPlugin);
  app.register(authPlugin);
  authModule(app, container);
  userModule(app, container);
  productModule(app, container);
  return app;
}

export type AppInstance = ReturnType<typeof buildApp>;
