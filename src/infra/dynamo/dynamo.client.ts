import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { Agent } from "http";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { env } from "../config/env";

const agent = new Agent({ keepAlive: true });

export const dynamoDocClient = new DynamoDBClient({
  region: env.AWS_REGION,
  requestHandler: new NodeHttpHandler({
    httpAgent: agent,
  }),
});
