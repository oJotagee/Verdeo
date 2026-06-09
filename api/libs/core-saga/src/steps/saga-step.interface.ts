import { Result } from 'neverthrow';

export interface SagaStep<TContext> {
  execute(context: TContext): Promise<Result<TContext, Error>>;
  compensate(context: TContext): Promise<void>;
}
