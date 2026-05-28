// Exceções de domínio
export { DomainException } from './exceptions/domain.exception';
export { ValidationException } from './exceptions/validation.exception';
export { NotFoundException } from './exceptions/not-found.exception';
export { ConflictException } from './exceptions/conflict.exception';
export { ForbiddenException } from './exceptions/forbidden.exception';
export { UnprocessableEntityException } from './exceptions/unprocessable-entity.exception';

// Correlação
export { correlationStorage, CorrelationContext } from './correlation/correlation.storage';

// Interceptors
export { CorrelationInterceptor } from './interceptors/correlation.interceptor';
export { LoggingInterceptor } from './interceptors/logging.interceptor';
