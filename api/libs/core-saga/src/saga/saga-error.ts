import { DomainException } from '@app/core-shared';

export class SagaError extends DomainException {
  public readonly failedStep: string;
  public readonly cause: Error;
  public readonly compensationErrors: Error[];

  constructor(failedStep: string, cause: Error, compensationErrors: Error[] = []) {
    super(`Saga falhou no passo '${failedStep}': ${cause.message}`, 'SAGA_ERROR');
    this.name = 'SagaError';
    this.failedStep = failedStep;
    this.cause = cause;
    this.compensationErrors = compensationErrors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
