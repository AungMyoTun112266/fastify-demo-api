export interface DomainEvent<TType extends string = string, TPayload = unknown> {
  type: TType;
  occurredAt: string;
  payload: TPayload;
}
