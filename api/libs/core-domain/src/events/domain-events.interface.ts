export interface DomainEvent {
  eventId: string;
  eventType: string;
  source: string;
  occurredAt: string;
  correlationId?: string;
  payload: unknown;
}
