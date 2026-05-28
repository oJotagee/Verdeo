import { DomainEvent } from './domain-events.interface';
import { randomUUID } from 'crypto';

const SOURCE = 'order-api';
const now = () => new Date().toISOString();

export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
  total: number;
  createdAt: string;
}

export interface OrderConfirmedPayload {
  orderId: string;
  userId: string;
  confirmedAt: string;
}

export interface OrderCancelledPayload {
  orderId: string;
  userId: string;
  reason: string;
  cancelledAt: string;
}

export interface OrderDeliveredPayload {
  orderId: string;
  userId: string;
  deliveredAt: string;
}

export function createOrderCreatedEvent(
  payload: OrderCreatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'order.created',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createOrderConfirmedEvent(
  payload: OrderConfirmedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'order.confirmed',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createOrderCancelledEvent(
  payload: OrderCancelledPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'order.cancelled',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createOrderDeliveredEvent(
  payload: OrderDeliveredPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'order.delivered',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}
