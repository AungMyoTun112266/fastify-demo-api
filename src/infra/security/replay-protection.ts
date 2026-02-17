import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDocClient } from "../dynamo/dynamo.client";
import { env } from "../config/env";
import { ConflictError } from "../../shared/errors";
import { InMemoryEventBus } from "../../shared/events/event-bus";
import { replayAttackDetectedEvent } from "./security.events";

export async function preventReplay(
  nonce: string,
  eventBus?: InMemoryEventBus,
  context?: { ip?: string; userAgent?: string }
) {
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
    if (eventBus) {
      void eventBus.publish(
        replayAttackDetectedEvent({
          nonce,
          ip: context?.ip,
          userAgent: context?.userAgent,
        })
      );
    }
    throw new ConflictError("Replay attack detected");
  }
}
