import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "./product.service";
import { BaseController } from "../../shared/base.controller";
import { ProductParams, ProductBody } from "./product.schema";

export class ProductController extends BaseController {
  constructor(private readonly service: ProductService) {
    super();
  }

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as ProductBody;
    console.log("Created product:", body);
    const product = await this.service.create(body);
    return this.created(product, reply);
  };

  findById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as ProductParams;
    return this.ok(await this.service.findById(id), reply);
  };

  findAll = async (_request: FastifyRequest, reply: FastifyReply) => {
    return this.ok(await this.service.findAll(), reply);
  };
}
