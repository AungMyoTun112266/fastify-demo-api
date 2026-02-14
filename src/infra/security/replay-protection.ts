import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDocClient } from "../dynamo/dynamo.client";
import { env } from "../config/env";
import { ConflictError } from "../../shared/errors";

export async function preventReplay(nonce: string) {
  const now = Math.floor(Date.now() / 1000);
  const ttl = 60 * 10; // 10 minutes only (better than 1 day)

  try {
    await dynamoDocClient.send(
      new PutCommand({
        TableName: env.DYNAMO_HMAC_TABLE,
        Item: {
          nonce,
          ttl: now + ttl,
        },
        ConditionExpression: "attribute_not_exists(nonce)",
      })
    );
  } catch {
    throw new ConflictError("Replay attack detected");
  }
}
