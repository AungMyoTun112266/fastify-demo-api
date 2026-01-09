import { ConflictError, NotFoundError } from "../../shared/errors";
import { UserRepository } from "./user.repository";
import { CreateUserInput, User } from "./user.types";

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async create(input: CreateUserInput): Promise<User> {
    const existing = await this.repo.findById(input.id);
    if (existing) {
      throw new ConflictError(`User with id ${input.id} already exists`);
    }

    const user: User = {
      id: input.id,
      name: input.name,
      age: input.age,
      active: input.active,
    };
    return this.repo.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return user;
  }
}
