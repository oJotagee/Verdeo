export class TimeoutException extends Error {
  constructor(timeoutMs: number) {
    super(`Chamada excedeu o tempo limite de ${timeoutMs}ms`);
    this.name = 'TimeoutException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
