import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(resource: string, identifier: string) {
    super(`${resource} com identificador '${identifier}' não encontrado.`, 'NOT_FOUND');
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
