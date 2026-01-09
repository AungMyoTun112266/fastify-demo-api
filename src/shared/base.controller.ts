import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";

export abstract class BaseController {
  protected handle(
    handler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  ): RouteHandlerMethod {
    return async (request, reply) => {
      await handler(request, reply);
    };
  }

  protected created<T>(data: T, reply: FastifyReply): void {
    reply.code(201).send(data);
  }

  protected ok<T>(data: T, reply: FastifyReply): void {
    reply.code(200).send(data);
  }

  protected noContent(reply: FastifyReply): void {
    reply.code(204).send();
  }

  protected badRequest(error: any, reply: FastifyReply): void {
    reply.code(400).send({ error });
  }

  protected notFound(reply: FastifyReply): void {
    reply.code(404).send({ error: "Not found" });
  }

  protected internalError(error: any, reply: FastifyReply): void {
    reply.code(500).send({ error });
  }
}
