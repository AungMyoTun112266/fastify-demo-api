import { AppInstance } from "../../app";
import { AppContainer } from "../../container/container";
import {
  userBodySchema,
  userParamsSchema,
  userQuerySchema,
  userResponseSchema,
} from "./user.schema";

export async function userRoutes(app: AppInstance, container: AppContainer) {
  const { userController } = container;

  app.register(async (user) => {
    user.route({
      method: "POST",
      url: "/:id",
      schema: {
        params: userParamsSchema,
        querystring: userQuerySchema,
        body: userBodySchema,
        response: { 201: userResponseSchema },
      },
      handler: userController.create.bind(userController),
    });

    user.route({
      method: "GET",
      url: "/:id",
      schema: {
        params: userParamsSchema,
        response: { 200: userResponseSchema },
      },
      handler: userController.findById.bind(userController),
    });
  });
}
