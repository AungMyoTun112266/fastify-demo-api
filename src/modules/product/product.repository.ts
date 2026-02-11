import { Product } from "./product.types";
import { ListableRepository } from "../../shared/types/repository";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class ProductRepository implements ListableRepository<Product> {
  constructor(
    private readonly docClient: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async save(entity: Product): Promise<Product> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: entity,
      })
    );
    return entity;
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": id,
        },
        Limit: 1,
      })
    );

    return (result.Items?.[0] as Product) ?? null;
  }

  async findAll(): Promise<Product[]> {
    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    return (result.Items as Product[]) ?? [];
  }
}
