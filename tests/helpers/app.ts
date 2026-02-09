import { buildApp } from "../../src/app";
import { zodPlugin } from "../../src/plugins/zod";

export async function createTestApp() {
  const app = buildApp();
  await zodPlugin(app);
  await app.ready();
  return app;
}

export const AUTH_HEADER = "Bearer valid-token";
