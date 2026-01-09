import { FastifyError, FastifyInstance } from "fastify";
import {
  HttpError,
  isFastifyValidationError,
  formatValidationErrors,
  ValidationError,
  InternalServerError,
} from "../shared/errors";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (isFastifyValidationError(error) && error.validation) {
      const validationError = new ValidationError(
        formatValidationErrors(error)
      );

      return reply.status(validationError.statusCode).send({
        ...validationError.toProblem(),
        instance: request.url,
      });
    }

    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        ...error.toProblem(),
        instance: request.url,
      });
    }

    request.log.error(error);
    const internalError = new InternalServerError();
    return reply.status(internalError.statusCode).send({
      ...internalError.toProblem(),
      instance: request.url,
    });
  });
}
