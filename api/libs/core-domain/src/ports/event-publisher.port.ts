import { DomainEvent } from '../events/domain-events.interface';

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');

export interface EventEnvelope<T = unknown> {
  readonly eventId: string;
  readonly eventType: string;
  readonly source: string;
  readonly occurredAt: string;
  readonly correlationId: string;
  readonly payload: T;
}

export interface EventPublisher {
  publish(event: EventEnvelope): Promise<void>;
  publishAll(events: EventEnvelope[]): Promise<void>;
}

export function toEnvelope(event: DomainEvent): EventEnvelope {
  return {
    eventId: event.eventId,
    eventType: event.eventType,
    source: event.source,
    occurredAt: event.occurredAt,
    correlationId: event.correlationId ?? '',
    payload: event.payload,
  };
}
