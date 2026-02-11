import { FastifyReply } from "fastify";

export abstract class BaseController {
  protected created<T>(data: T, reply: FastifyReply) {
    return reply.code(201).send(data);
  }

  protected ok<T>(data: T, reply: FastifyReply) {
    return reply.code(200).send(data);
  }

  protected noContent(reply: FastifyReply) {
    return reply.code(204).send();
  }
}
