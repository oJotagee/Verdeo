import { DomainEvent } from './domain-events.interface';
import { randomUUID } from 'crypto';

const SOURCE = 'user-api';
const now = () => new Date().toISOString();

export interface UserCreatedPayload {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  active: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface UserUpdatedPayload {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface UserAuthenticatedPayload {
  userId: string;
  username: string;
  authenticatedAt: string;
}

export interface UserBlockedPayload {
  userId: string;
  username: string;
  failedAttempts: number;
  blockedUntil?: string;
  blockedAt: string;
}

export interface UserDisabledPayload {
  userId: string;
  username: string;
  reason?: string;
  disabledAt: string;
}

export interface UserEnabledPayload {
  userId: string;
  username: string;
  enabledAt: string;
}

export interface UserDeletedPayload {
  userId: string;
  username: string;
  deletedAt: string;
}

export function createUserCreatedEvent(
  payload: UserCreatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'user.created',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createUserUpdatedEvent(
  payload: UserUpdatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'user.updated',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createUserAuthenticatedEvent(
  payload: UserAuthenticatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'auth.authenticated',
    source: 'auth-api',
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createUserBlockedEvent(
  payload: UserBlockedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'auth.blocked',
    source: 'auth-api',
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createUserDisabledEvent(
  payload: UserDisabledPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'user.disabled',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createUserEnabledEvent(
  payload: UserEnabledPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'user.enabled',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createUserDeletedEvent(
  payload: UserDeletedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'user.deleted',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}
