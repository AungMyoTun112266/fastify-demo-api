import { UserRepository } from "../modules/user/user.repository";
import { UserService } from "../modules/user/user.service";
import { UserController } from "../modules/user/user.controller";

export function createContainer() {
  // repositories
  const userRepository = new UserRepository();

  // services
  const userService = new UserService(userRepository);

  // controllers
  const userController = new UserController(userService);

  return {
    userController,
  };
}

export type AppContainer = ReturnType<typeof createContainer>;
