import { ConflictError, NotFoundError } from "../../shared/errors";
import { Repository } from "../../shared/types/repository";
import { hashPassword } from "../../shared/utils/password";
import { CreateUserInput, User } from "./user.types";

export class UserService {
  constructor(private readonly repo: Repository<User>) {}

  async create(input: CreateUserInput): Promise<User> {
    const existing = await this.repo.findById(input.id);
    if (existing) {
      throw new ConflictError(`User with id ${input.id} already exists`);
    }

    const user: User = {
      id: input.id,
      sk: "USER",
      name: input.name,
      age: input.age,
      active: input.active,
      password: await hashPassword(input.password),
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
