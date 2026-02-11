import { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../../shared/base.controller";
import { AuthService } from "./auth.service";
import { SignupBody, SigninBody } from "./auth.schema";

export class AuthController extends BaseController {
  constructor(private readonly service: AuthService) {
    super();
  }

  signup = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as SignupBody;
    const result = await this.service.signup(body);
    return this.created(result, reply);
  };

  signin = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as SigninBody;
    const result = await this.service.signin(body);
    return this.ok(result, reply);
  };
}
