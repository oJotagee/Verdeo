import { DomainEvent } from './domain-events.interface';
import { randomUUID } from 'crypto';

const SOURCE = 'stock-api';
const now = () => new Date().toISOString();

export interface ProductCreatedPayload {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdBy?: string;
  createdAt: string;
}

export interface ProductUpdatedPayload {
  productId: string;
  name: string;
  price: number;
  updatedBy?: string;
  updatedAt: string;
}

export interface ProductStockDecreasedPayload {
  productId: string;
  quantityDecreased: number;
  remainingQuantity: number;
  occurredAt: string;
}

export interface ProductDeactivatedPayload {
  productId: string;
  name: string;
  deactivatedAt: string;
}

export function createProductCreatedEvent(
  payload: ProductCreatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'stock.product.created',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createProductUpdatedEvent(
  payload: ProductUpdatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'stock.product.updated',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createProductStockDecreasedEvent(
  payload: ProductStockDecreasedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'stock.decreased',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}

export function createProductDeactivatedEvent(
  payload: ProductDeactivatedPayload,
  correlationId?: string,
): DomainEvent {
  return {
    eventId: randomUUID(),
    eventType: 'stock.product.deactivated',
    source: SOURCE,
    occurredAt: now(),
    correlationId,
    payload,
  };
}
