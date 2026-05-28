// Aggregate base
export { AggregateRoot } from './aggregates/aggregate-root';

// Domain event interface
export type { DomainEvent } from './events/domain-events.interface';

// Value objects
export { StockQuantity } from './value-objects/stock-quantity.vo';
export { ProductId } from './value-objects/product-id.vo';
export { Password } from './value-objects/password.vo';
export { Username } from './value-objects/username.vo';
export { OrderId } from './value-objects/order-id.vo';
export { UserId } from './value-objects/user-id.vo';
export { Email } from './value-objects/email.vo';
export { Price } from './value-objects/price.vo';

// Entities
export type { CreateOrderProps, OrderProps, OrderItem, OrderStatus } from './entities/order.entity';
export type { CreateUserProps, UpdateUserProps, UserProps } from './entities/user.entity';
export { Product } from './entities/product.entity';
export { Order } from './entities/order.entity';
export { User } from './entities/user.entity';
export type {
  CreateProductProps,
  UpdateProductProps,
  ProductProps,
} from './entities/product.entity';

// Domain errors
export type { UserDomainErrorCode, AuthSuccess, AuthFailure } from './errors/user-domain.error';
export type { ProductDomainErrorCode } from './errors/product-domain.error';
export type { OrderDomainErrorCode } from './errors/order-domain.error';
export { ProductDomainError } from './errors/product-domain.error';
export { OrderDomainError } from './errors/order-domain.error';
export { UserDomainError } from './errors/user-domain.error';

// User events
export {
  createUserCreatedEvent,
  createUserUpdatedEvent,
  createUserAuthenticatedEvent,
  createUserBlockedEvent,
  createUserDisabledEvent,
  createUserEnabledEvent,
  createUserDeletedEvent,
} from './events/user-events';
export type {
  UserCreatedPayload,
  UserUpdatedPayload,
  UserAuthenticatedPayload,
  UserBlockedPayload,
  UserDisabledPayload,
  UserEnabledPayload,
  UserDeletedPayload,
} from './events/user-events';

// Product events
export {
  createProductCreatedEvent,
  createProductUpdatedEvent,
  createProductStockDecreasedEvent,
  createProductDeactivatedEvent,
} from './events/product-events';
export type {
  ProductCreatedPayload,
  ProductUpdatedPayload,
  ProductStockDecreasedPayload,
  ProductDeactivatedPayload,
} from './events/product-events';

// Order events
export {
  createOrderCreatedEvent,
  createOrderConfirmedEvent,
  createOrderCancelledEvent,
  createOrderDeliveredEvent,
} from './events/order-events';
export type {
  OrderCreatedPayload,
  OrderConfirmedPayload,
  OrderCancelledPayload,
  OrderDeliveredPayload,
} from './events/order-events';

// Ports
export type { EventPublisher, EventEnvelope } from './ports/event-publisher.port';
export { EVENT_PUBLISHER, toEnvelope } from './ports/event-publisher.port';
export type { ProductRepository } from './ports/product-repository.port';
export type { OrderRepository } from './ports/order-repository.port';
export type { PasswordEncoder } from './ports/password-encoder.port';
export { PRODUCT_REPOSITORY } from './ports/product-repository.port';
export type { UserRepository } from './ports/user-repository.port';
export { PASSWORD_ENCODER } from './ports/password-encoder.port';
export { ORDER_REPOSITORY } from './ports/order-repository.port';
export { USER_REPOSITORY } from './ports/user-repository.port';
export type { UserCache } from './ports/user-cache.port';
export { USER_CACHE } from './ports/user-cache.port';
