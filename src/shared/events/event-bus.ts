import { DomainEvent } from "./domain-event";

export type DomainEventHandler<E extends DomainEvent = DomainEvent> = (
  event: E
) => Promise<void> | void;

export class InMemoryEventBus {
  private readonly handlers: Record<string, DomainEventHandler[]> = {};

  on<T extends DomainEvent>(
    type: T["type"],
    handler: DomainEventHandler<T>
  ): void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler as DomainEventHandler);
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const handlers = this.handlers[event.type] ?? [];
    if (handlers.length === 0) return;

    await Promise.allSettled(handlers.map((handler) => handler(event)));
  }
}
