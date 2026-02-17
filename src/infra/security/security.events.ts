import { DomainEvent } from "../../shared/events/domain-event";

export const REPLAY_ATTACK_DETECTED = "REPLAY_ATTACK_DETECTED" as const;

export type ReplayAttackDetectedEvent = DomainEvent<
  typeof REPLAY_ATTACK_DETECTED,
  {
    nonce: string;
    ip?: string;
    userAgent?: string;
  }
>;

export function replayAttackDetectedEvent(
  payload: ReplayAttackDetectedEvent["payload"]
): ReplayAttackDetectedEvent {
  return {
    type: REPLAY_ATTACK_DETECTED,
    occurredAt: new Date().toISOString(),
    payload,
  };
}
