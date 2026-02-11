import { dynamoDocClient } from "../infra/dynamo/dynamo.client";
import { cognitoClient } from "../infra/cognito/cognito.client";
import { env } from "../infra/config/env";
import { UserRepository } from "../modules/user/user.repository";
import { UserService } from "../modules/user/user.service";
import { UserController } from "../modules/user/user.controller";
import { ProductRepository } from "../modules/product/product.repository";
import { ProductService } from "../modules/product/product.service";
import { ProductController } from "../modules/product/product.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";

export function createContainer() {
  // repositories
  const userRepository = new UserRepository(dynamoDocClient, env.USERS_TABLE);
  const productRepository = new ProductRepository(dynamoDocClient, env.PRODUCTS_TABLE);

  // services
  const userService = new UserService(userRepository);
  const productService = new ProductService(productRepository);
  const authService = new AuthService(userRepository, cognitoClient, {
    userPoolId: env.COGNITO_USER_POOL_ID,
    clientId: env.COGNITO_CLIENT_ID,
  });

  // controllers
  const userController = new UserController(userService);
  const productController = new ProductController(productService);
  const authController = new AuthController(authService);

  return {
    userController,
    productController,
    authController,
  };
}

export type AppContainer = ReturnType<typeof createContainer>;
