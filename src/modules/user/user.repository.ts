import { User } from "./user.types";
import { Repository } from "../../shared/types/repository";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ConflictError } from "../../shared/errors";

export class UserRepository implements Repository<User> {
  constructor(
    private readonly docClient: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async save(entity: User): Promise<User> {
    try {
      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: entity,
        })
      );
      return entity;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ConditionalCheckFailedException") {
        throw new ConflictError("User already exists");
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
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

    return (result.Items?.[0] as User) ?? null;
  }
}
