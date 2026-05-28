import { DomainException } from './domain.exception';

export class ForbiddenException extends DomainException {
  constructor(message: string, errorCode: string = 'FORBIDDEN') {
    super(message, errorCode);
    this.name = 'ForbiddenException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
