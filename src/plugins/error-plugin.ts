import { FastifyError, FastifyInstance } from "fastify";
import {
  HttpError,
  isFastifyValidationError,
  formatValidationErrors,
  ValidationError,
  InternalServerError,
} from "../shared/errors";

export async function errorPlugin(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const instance = request.url;

    if (isInvalidJsonError(error)) {
      return sendProblem(
        reply,
        new ValidationError(
          { body: "Request body contains invalid JSON syntax." },
          "Invalid JSON payload"
        ),
        instance
      );
    }

    if (isFastifyValidationError(error) && error.validation) {
      return sendProblem(
        reply,
        new ValidationError(formatValidationErrors(error)),
        instance
      );
    }

    if (error instanceof HttpError) {
      return sendProblem(reply, error, instance);
    }

    request.log.error(error);
    return sendProblem(reply, new InternalServerError(), instance);
  });
}

function isInvalidJsonError(error: unknown): boolean {
  return (error as FastifyError)?.code === "FST_ERR_CTP_INVALID_JSON_BODY";
}

function sendProblem(reply: any, error: HttpError, instance: string) {
  return reply.status(error.statusCode).send({
    ...error.toProblem(),
    instance,
  });
}
