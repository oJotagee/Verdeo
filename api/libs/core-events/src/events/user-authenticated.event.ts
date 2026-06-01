import { randomUUID } from 'node:crypto';

import { EventEnvelope } from '@app/core-domain';

export interface UserAuthenticatedPayload {
  userId: string;
  email: string;
}

export function createUserAuthenticatedEvent(
  payload: UserAuthenticatedPayload,
  correlationId: string,
): EventEnvelope<UserAuthenticatedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.authenticated',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId: correlationId,
    payload,
  };
}
