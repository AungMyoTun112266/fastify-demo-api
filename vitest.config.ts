import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: ".",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/helpers/jwt-mock.ts"],
    env: {
      USERS_TABLE: "test_user",
      PRODUCTS_TABLE: "test_product",
      COGNITO_USER_POOL_ID: "ap-northeast-1_TestPool",
      COGNITO_CLIENT_ID: "test-client-id",
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts", "src/index.ts"],
    },
  },
});
