import { randomUUID } from 'node:crypto';

import { EventEnvelope } from '@app/core-domain';

export interface UserUpdatedPayload {
  userId: string;
  name?: string;
  email?: string;
  fullName?: string;
  active?: boolean;
}

export function createUserUpdatedEvent(
  payload: UserUpdatedPayload,
  correlationId: string,
): EventEnvelope<UserUpdatedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'user.updated',
    source: 'user-api',
    occurredAt: new Date().toISOString(),
    correlationId: correlationId,
    payload,
  };
}
