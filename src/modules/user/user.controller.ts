import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service";
import { BaseController } from "../../shared/base.controller";
import { UserParams, UserQuery, UserBody } from "./user.schema";

export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
  }

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as UserParams;
    const { active } = request.query as UserQuery;
    const body = request.body as UserBody;

    const user = await this.service.create({ id, active, ...body });
    return this.created(user, reply);
  };

  findById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as UserParams;
    return this.ok(await this.service.findById(id), reply);
  };
}
