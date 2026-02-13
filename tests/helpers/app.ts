import { buildApp } from "../../src/app";
export async function createTestApp() {
  const app = buildApp();
  await app.ready();
  return app;
}

export const AUTH_HEADER = "Bearer valid-token";
export const USER_AUTH_HEADER = "Bearer user-token";
