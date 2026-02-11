import { randomUUID } from "crypto";
import { NotFoundError } from "../../shared/errors";
import { ListableRepository } from "../../shared/types/repository";
import { CreateProductInput, Product } from "./product.types";

export class ProductService {
  constructor(private readonly repo: ListableRepository<Product>) {}

  async create(input: CreateProductInput): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      name: input.name,
      price: input.price,
      description: input.description,
      category: input.category,
      active: true,
    };
    return this.repo.save(product);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.repo.findAll();
  }
}
