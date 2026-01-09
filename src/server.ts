import { buildApp } from "./app";
import { zodPlugin } from "./plugins/zod";

const app = buildApp();

async function bootstrap() {
  await zodPlugin(app);
  await app.listen({ port: 3000 });
  console.log("🚀 Server running at http://localhost:3000");
}

bootstrap();
