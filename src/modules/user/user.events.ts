import { DomainEvent } from "../../shared/events/domain-event";

export const USER_CREATED = "USER_CREATED" as const;

export type UserCreatedEvent = DomainEvent<
  typeof USER_CREATED,
  {
    userId: string;
    active: boolean;
    actorId?: string;
  }
>;

export function userCreatedEvent(
  payload: UserCreatedEvent["payload"]
): UserCreatedEvent {
  return {
    type: USER_CREATED,
    occurredAt: new Date().toISOString(),
    payload,
  };
}
