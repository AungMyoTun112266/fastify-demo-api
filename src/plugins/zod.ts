import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";

export async function zodPlugin(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
}
