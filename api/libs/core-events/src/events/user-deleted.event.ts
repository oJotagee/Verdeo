import { randomUUID } from 'crypto';

import { EventEnvelope } from '@app/core-domain';

export interface UserDeletedPayload {
  userId: string;
}

export function createUserDeletedEvent(
  payload: UserDeletedPayload,
  correlationId: string,
): EventEnvelope<UserDeletedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.deleted',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId: correlationId,
    payload,
  };
}
