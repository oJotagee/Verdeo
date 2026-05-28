export class DomainException extends Error {
  constructor(
    message: string,
    public readonly errorCode: string = 'DOMAIN_ERROR',
  ) {
    super(message);
    this.name = 'DomainException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
