import { AuditEvents, AuditService } from "./audit.service";
import {
  USER_CREATED,
  UserCreatedEvent,
} from "../../modules/user/user.events";
import {
  REPLAY_ATTACK_DETECTED,
  ReplayAttackDetectedEvent,
} from "../security/security.events";
import { InMemoryEventBus } from "../../shared/events/event-bus";

export function registerAuditHandlers(
  bus: InMemoryEventBus,
  auditService: AuditService
): void {
  bus.on<UserCreatedEvent>(USER_CREATED, async (event) => {
    await auditService.log({
      event: AuditEvents.USER_CREATE,
      actorId: event.payload.actorId ?? event.payload.userId,
      targetId: event.payload.userId,
      success: true,
      metadata: {
        active: event.payload.active,
      },
    });
  });

  bus.on<ReplayAttackDetectedEvent>(REPLAY_ATTACK_DETECTED, async (event) => {
    await auditService.log({
      event: AuditEvents.REPLAY_ATTACK_DETECTED,
      ip: event.payload.ip,
      userAgent: event.payload.userAgent,
      success: false,
      metadata: {
        nonce: event.payload.nonce,
      },
    });
  });
}
