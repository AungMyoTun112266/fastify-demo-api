import { ConflictError, NotFoundError } from "../../shared/errors";
import { InMemoryEventBus } from "../../shared/events/event-bus";
import { Repository } from "../../shared/types/repository";
import { hashPassword } from "../../shared/utils/password";
import { userCreatedEvent } from "./user.events";
import { CreateUserInput, User, UserPublic } from "./user.types";

export class UserService {
  constructor(
    private readonly repo: Repository<User>,
    private readonly eventBus: InMemoryEventBus
  ) {}

  async create(input: CreateUserInput): Promise<UserPublic> {
    const existing = await this.repo.findById(input.id);
    if (existing) {
      throw new ConflictError(`User with id ${input.id} already exists`);
    }

    const user = await User.create(input, hashPassword);
    const savedUser = await this.repo.save(user);
    void this.eventBus.publish(
      userCreatedEvent({
        userId: input.id,
        actorId: input.id,
        active: savedUser.active,
      })
    );
    return savedUser.toPublic();
  }

  async findById(id: string): Promise<UserPublic> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return user.toPublic();
  }
}
