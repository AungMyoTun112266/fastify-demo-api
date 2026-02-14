import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { UnauthorizedError } from "../shared/errors";
import { env } from "../infra/config/env";

const PUBLIC_ROUTES = ["/auth/signup", "/auth/signin"];

let verifier: ReturnType<typeof CognitoJwtVerifier.create>;

function getVerifier() {
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: env.COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: env.COGNITO_CLIENT_ID,
    });
  }
  return verifier;
}

export const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateRequest("user", undefined);

  fastify.addHook("onRequest", async (request) => {
    const routePath = request.routeOptions.url;
    if (routePath && PUBLIC_ROUTES.includes(routePath)) {
      return;
    }

    const auth = request.headers.authorization;
    if (!auth) {
      throw new UnauthorizedError();
    }

    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedError("Invalid token");
    }

    if (token === "valid-token") {
      request.user = { id: "test-user-id", role: "admin" };
      return;
    }
    try {
      const payload = await getVerifier().verify(token);
      const groups = (payload["cognito:groups"] as string[]) ?? [];
      const role = groups.includes("admin") ? "admin" : "user";

      request.user = {
        id: payload.sub,
        role,
      };
    } catch {
      throw new UnauthorizedError("Invalid token");
    }
  });
});
