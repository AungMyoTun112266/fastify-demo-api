import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

export const AuditEvents = {
  USER_CREATE: "USER_CREATE",
  USER_CREATE_CONFLICT: "USER_CREATE_CONFLICT",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  REPLAY_ATTACK_DETECTED: "REPLAY_ATTACK_DETECTED",
} as const;

interface AuditEvent {
  event: string;
  actorId?: string;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  constructor(
    private readonly dynamo: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async log(event: AuditEvent): Promise<void> {
    const timestamp = new Date().toISOString();
    const actorId = event.actorId ?? "anonymous";

    const item = {
      pk: `USER#${actorId}`,
      sk: `TIMESTAMP#${timestamp}`,
      id: randomUUID(),
      ...event,
      timestamp,
    };
    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }
}
