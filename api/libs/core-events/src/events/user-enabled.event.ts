import { randomUUID } from 'node:crypto';

import { EventEnvelope } from '@app/core-domain';

export interface UserEnabledPayload {
  userId: string;
  reason: string;
}

export function createUserEnabledEvent(
  payload: UserEnabledPayload,
  correlationId: string,
): EventEnvelope<UserEnabledPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.enabled',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId: correlationId,
    payload,
  };
}
