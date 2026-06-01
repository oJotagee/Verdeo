// Envelope de evento de domínio
export type { EventEnvelope } from './envelope/event-envelope';

// Factories de eventos de usuário
export type { UserCreatedPayload } from './events/user-created.event';
export { createUserCreatedEvent } from './events/user-created.event';

export type { UserUpdatedPayload } from './events/user-updated.event';
export { createUserUpdatedEvent } from './events/user-updated.event';

export type { UserDeletedPayload } from './events/user-deleted.event';
export { createUserDeletedEvent } from './events/user-deleted.event';

export type { UserDisabledPayload } from './events/user-disabled.event';
export { createUserDisabledEvent } from './events/user-disabled.event';

export type { UserEnabledPayload } from './events/user-enabled.event';
export { createUserEnabledEvent } from './events/user-enabled.event';

export type { UserAuthenticatedPayload } from './events/user-authenticated.event';
export { createUserAuthenticatedEvent } from './events/user-authenticated.event';

export type { UserBlockedPayload } from './events/user-blocked.event';
export { createUserBlockedEvent } from './events/user-blocked.event';

// Factories de eventos do e-commerce de plantas
export type { ProductCreatedPayload } from './events/product-created.event';
export { createProductCreatedEvent } from './events/product-created.event';

export type { OrderCreatedPayload } from './events/order-created.event';
export { createOrderCreatedEvent } from './events/order-created.event';

// Adapter de publicação RabbitMQ
export {
  RabbitMQEventPublisherAdapter,
  RABBITMQ_CLIENT,
} from './publisher/rabbitmq-event-publisher.adapter';

// Módulo NestJS
export type { EventsModuleOptions } from './events.module';
export { EventsModule } from './events.module';
