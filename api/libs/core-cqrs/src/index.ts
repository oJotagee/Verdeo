// Interfaces tipadas com phantom types
export { ICommand } from './commands/command.interface';
export { IQuery } from './queries/query.interface';

// Módulo NestJS
export { CqrsLibModule } from './cqrs.module';

// Re-exportações do @nestjs/cqrs para uso centralizado
export {
  CommandBus,
  QueryBus,
  EventBus,
  CommandHandler,
  QueryHandler,
  ICommandHandler,
  IQueryHandler,
} from '@nestjs/cqrs';
