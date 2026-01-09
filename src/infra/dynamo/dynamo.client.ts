import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "../config/env";

const client = new DynamoDBClient({
  region: env.AWS_REGION,
});

export const dynamoDocClient = DynamoDBDocumentClient.from(client);
