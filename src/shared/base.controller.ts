import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";

export abstract class BaseController {
  protected handle<T>(
    fn: (req: FastifyRequest, reply: FastifyReply) => Promise<T>
  ) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      return fn(req, reply);
    };
  }

  protected created<T>(data: T, reply: FastifyReply) {
    reply.code(201).send(data);
  }

  protected ok<T>(data: T, reply: FastifyReply) {
    return reply.code(200).send(data);
  }

  protected noContent(reply: FastifyReply) {
    reply.code(204).send();
  }

  protected badRequest(error: any, reply: FastifyReply) {
    reply.code(400).send({ error });
  }

  protected notFound(reply: FastifyReply) {
    reply.code(404).send({ error: "Not found" });
  }

  protected internalError(error: any, reply: FastifyReply) {
    reply.code(500).send({ error });
  }
}
