import { AppInstance } from "../../app";
import { AppContainer } from "../../container/container";
import {
  userParamsSchema,
  userQuerySchema,
  userBodySchema,
  userResponseSchema,
} from "./user.schema";

export async function userRoutes(app: AppInstance, container: AppContainer) {
  app.post(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
        querystring: userQuerySchema,
        body: userBodySchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    container.userController.create
  );
  app.get(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    container.userController.findById
  );
}
