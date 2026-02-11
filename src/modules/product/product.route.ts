import { AppInstance } from "../../app";
import { AppContainer } from "../../container/container";
import {
  productParamsSchema,
  productBodySchema,
  productResponseSchema,
  productListResponseSchema,
} from "./product.schema";

export async function productRoutes(app: AppInstance, container: AppContainer) {
  app.post(
    "/",
    {
      schema: {
        body: productBodySchema,
        response: {
          201: productResponseSchema,
        },
      },
    },
    container.productController.create
  );

  app.get(
    "/:id",
    {
      schema: {
        params: productParamsSchema,
        response: {
          200: productResponseSchema,
        },
      },
    },
    container.productController.findById
  );

  app.get(
    "/",
    {
      schema: {
        response: {
          200: productListResponseSchema,
        },
      },
    },
    container.productController.findAll
  );
}
