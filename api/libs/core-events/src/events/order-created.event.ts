import { randomUUID } from 'crypto';

import { EventEnvelope } from '@app/core-domain';

export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  createdAt: string;
}

export function createOrderCreatedEvent(
  payload: OrderCreatedPayload,
  correlationId: string,
): EventEnvelope<OrderCreatedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'order.created',
    source: 'order-api',
    occurredAt: new Date().toISOString(),
    correlationId,
    payload,
  };
}
