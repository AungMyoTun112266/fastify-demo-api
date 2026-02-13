import { buildApp } from "./app";
const app = buildApp();

async function bootstrap() {
  await app.listen({ port: 3000 });
  console.log("🚀 Server running at http://localhost:3000");
}

bootstrap();
