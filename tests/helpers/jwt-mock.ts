import { vi } from "vitest";

vi.mock("aws-jwt-verify", () => {
  return {
    CognitoJwtVerifier: {
      create: () => ({
        verify: vi.fn().mockImplementation(async (token: string) => {
          if (token === "valid-token") {
            return {
              sub: "user-123",
              "cognito:groups": ["admin"],
              token_use: "access",
            };
          }
          throw new Error("Invalid token");
        }),
      }),
    },
  };
});
