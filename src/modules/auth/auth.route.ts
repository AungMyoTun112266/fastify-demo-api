import { AppInstance } from "../../app";
import { AppContainer } from "../../container/container";
import {
  signupBodySchema,
  signinBodySchema,
  signupResponseSchema,
  authResponseSchema,
} from "./auth.schema";

export async function authRoutes(app: AppInstance, container: AppContainer) {
  app.post(
    "/signup",
    {
      schema: {
        body: signupBodySchema,
        response: {
          201: signupResponseSchema,
        },
      },
    },
    container.authController.signup
  );

  app.post(
    "/signin",
    {
      schema: {
        body: signinBodySchema,
        response: {
          200: authResponseSchema,
        },
      },
    },
    container.authController.signin
  );
}
