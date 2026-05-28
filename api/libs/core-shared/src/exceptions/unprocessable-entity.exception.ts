import { DomainException } from './domain.exception';

export class UnprocessableEntityException extends DomainException {
  constructor(message: string, errorCode: string = 'UNPROCESSABLE_ENTITY') {
    super(message, errorCode);
    this.name = 'UnprocessableEntityException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
