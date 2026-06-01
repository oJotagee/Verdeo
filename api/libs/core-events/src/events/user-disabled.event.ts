import { randomUUID } from 'node:crypto';

import { EventEnvelope } from '@app/core-domain';

export interface UserDisabledPayload {
  userId: string;
  reason: string;
}

export function createUserDisabledEvent(
  payload: UserDisabledPayload,
  correlationId: string,
): EventEnvelope<UserDisabledPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.disabled',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId: correlationId,
    payload,
  };
}
