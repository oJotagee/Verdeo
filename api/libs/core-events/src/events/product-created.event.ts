import { randomUUID } from 'crypto';

import { EventEnvelope } from '@app/core-domain';

export interface ProductCreatedPayload {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdAt: string;
}

export function createProductCreatedEvent(
  payload: ProductCreatedPayload,
  correlationId: string,
): EventEnvelope<ProductCreatedPayload> {
  return {
    eventId: randomUUID(),
    eventType: 'product.created',
    source: 'product-api',
    occurredAt: new Date().toISOString(),
    correlationId,
    payload,
  };
}
