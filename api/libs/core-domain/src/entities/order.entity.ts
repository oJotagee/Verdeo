import { Result, ok, err } from 'neverthrow';

import { OrderDomainError } from '../errors/order-domain.error';
import { AggregateRoot } from '../aggregates/aggregate-root';
import { OrderId } from '../value-objects/order-id.vo';
import { Price } from '../value-objects/price.vo';
import {
  createOrderCreatedEvent,
  createOrderConfirmedEvent,
  createOrderCancelledEvent,
  createOrderDeliveredEvent,
} from '../events/order-events';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Transições de status permitidas no domínio
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Price;
}

export interface CreateOrderProps {
  id: string;
  userId: string;
  items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
  correlationId?: string;
}

export interface OrderProps {
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: Price;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot<OrderId> {
  private _props: OrderProps;

  private constructor(id: OrderId, props: OrderProps) {
    super(id);
    this._props = props;
  }

  get userId(): string {
    return this._props.userId;
  }

  get items(): OrderItem[] {
    return [...this._props.items];
  }

  get status(): OrderStatus {
    return this._props.status;
  }

  get total(): Price {
    return this._props.total;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  static create(props: CreateOrderProps): Result<Order, OrderDomainError> {
    try {
      if (!props.items || props.items.length === 0) {
        return err(OrderDomainError.orderEmpty());
      }

      const orderId = OrderId.create(props.id);

      const items: OrderItem[] = props.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: Price.create(i.unitPrice),
      }));

      const total = items.reduce(
        (acc, item) => acc.add(item.unitPrice.multiply(item.quantity)),
        Price.create(0),
      );

      const now = new Date();

      const order = new Order(orderId, {
        userId: props.userId,
        items,
        status: 'PENDING',
        total,
        createdAt: now,
        updatedAt: now,
      });

      order.addDomainEvent(
        createOrderCreatedEvent(
          {
            orderId: orderId.value,
            userId: props.userId,
            items: props.items,
            total: total.value,
            createdAt: now.toISOString(),
          },
          props.correlationId,
        ),
      );

      return ok(order);
    } catch (error) {
      return err(
        OrderDomainError.validationError(
          error instanceof Error ? error.message : 'Erro ao criar pedido.',
        ),
      );
    }
  }

  static reconstitute(id: string, props: OrderProps): Order {
    return new Order(OrderId.create(id), props);
  }

  private transitionTo(
    newStatus: OrderStatus,
    correlationId?: string,
  ): Result<void, OrderDomainError> {
    const allowed = VALID_TRANSITIONS[this._props.status];

    if (!allowed.includes(newStatus)) {
      return err(OrderDomainError.invalidStatusTransition(this._props.status, newStatus));
    }

    this._props.status = newStatus;
    this._props.updatedAt = new Date();

    return ok(undefined);
  }

  confirm(correlationId?: string): Result<void, OrderDomainError> {
    const result = this.transitionTo('CONFIRMED', correlationId);

    if (result.isOk()) {
      this.addDomainEvent(
        createOrderConfirmedEvent(
          {
            orderId: this.id.value,
            userId: this._props.userId,
            confirmedAt: this._props.updatedAt.toISOString(),
          },
          correlationId,
        ),
      );
    }

    return result;
  }

  cancel(reason: string, correlationId?: string): Result<void, OrderDomainError> {
    if (this._props.status === 'CANCELLED') return err(OrderDomainError.orderAlreadyCancelled());
    if (this._props.status === 'DELIVERED') return err(OrderDomainError.orderAlreadyDelivered());

    this._props.status = 'CANCELLED';
    this._props.updatedAt = new Date();

    this.addDomainEvent(
      createOrderCancelledEvent(
        {
          orderId: this.id.value,
          userId: this._props.userId,
          reason,
          cancelledAt: this._props.updatedAt.toISOString(),
        },
        correlationId,
      ),
    );

    return ok(undefined);
  }

  deliver(correlationId?: string): Result<void, OrderDomainError> {
    if (this._props.status === 'DELIVERED') return err(OrderDomainError.orderAlreadyDelivered());

    const result = this.transitionTo('DELIVERED', correlationId);

    if (result.isOk()) {
      this.addDomainEvent(
        createOrderDeliveredEvent(
          {
            orderId: this.id.value,
            userId: this._props.userId,
            deliveredAt: this._props.updatedAt.toISOString(),
          },
          correlationId,
        ),
      );
    }

    return result;
  }
}
