import { randomUUID } from 'crypto';

import { EventEnvelope } from '../envelope/event-envelope';

export interface UserCreatedPayload {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  active: boolean;
  createdAt: string;
}

export function createUserCreatedEvent(
  payload: UserCreatedPayload,
  correlationId: string,
): EventEnvelope<UserCreatedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.created',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId,
    payload,
  };
}
