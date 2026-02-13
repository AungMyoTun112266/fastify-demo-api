import { User, UserPersistence } from "./user.types";
import { Repository } from "../../shared/types/repository";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class UserRepository implements Repository<User> {
  constructor(
    private readonly docClient: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async save(entity: User): Promise<User> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: entity.toPersistence(),
      })
    );
    return entity;
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

    const item = result.Items?.[0] as UserPersistence | undefined;
    return item ? User.fromPersistence(item) : null;
  }
}
