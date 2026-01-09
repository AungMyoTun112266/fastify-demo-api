import { FastifyReply, FastifyRequest } from "fastify";
import { RouteHandlerMethod } from "fastify";
import { UserService } from "./user.service";
import { UserBody } from "./user.schema";
import { BaseController } from "../../shared/base.controller";
import { User } from "./user.types";

export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
  }

  create = this.handle(async (request, reply) => {
    const currentUser = request.user!;
    const { id } = request.params as { id: string };
    const { active } = request.query as { active: boolean };
    const body = request.body as UserBody;

    const user = await this.service.create({
      id,
      active,
      ...body,
    });
    return this.created<User>(user, reply);
  });

  findById = this.handle(async (request, reply) => {
    const { id } = request.params as { id: string };
    return this.ok<User>(await this.service.findById(id), reply);
  });
}
