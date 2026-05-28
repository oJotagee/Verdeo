import { DomainException } from './domain.exception';

export class ValidationException extends DomainException {
  constructor(message: string, errorCode: string = 'VALIDATION_ERROR') {
    super(message, errorCode);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
