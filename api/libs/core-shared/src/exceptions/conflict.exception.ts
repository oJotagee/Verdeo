import { DomainException } from './domain.exception';

export class ConflictException extends DomainException {
  constructor(message: string, errorCode: string = 'CONFLICT') {
    super(message, errorCode);
    this.name = 'ConflictException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
