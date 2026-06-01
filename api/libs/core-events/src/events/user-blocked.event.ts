import { randomUUID } from 'node:crypto';

import { EventEnvelope } from '@app/core-domain';

export interface UserBlockedPayload {
  userId: string;
}

export function createUserBlockedEvent(
  payload: UserBlockedPayload,
  correlationId: string,
): EventEnvelope<UserBlockedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.blocked',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId: correlationId,
    payload,
  };
}
