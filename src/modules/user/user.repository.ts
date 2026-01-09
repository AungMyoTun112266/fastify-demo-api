import { User } from "./user.types";
import { Repository } from "../../shared/types/repository";
import { dynamoDocClient } from "../../infra/dynamo/dynamo.client";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ConflictError } from "../../shared/errors";
import { env } from "../../infra/config/env";

export class UserRepository implements Repository<User> {
  private readonly tableName = env.USERS_TABLE;

  async save(entity: User): Promise<User> {
    try {
      await dynamoDocClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: entity,
        })
      );
      return entity;
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new ConflictError("User already exists");
      }
      throw error;
    }
  }
  async findById(id: string): Promise<User | null> {
    const result = await dynamoDocClient.send(
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
