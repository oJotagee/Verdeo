export interface Logger {
  log(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
}

export class NoOpLogger implements Logger {
  log(): void {}
  error(): void {}
}

export class ConsoleLogger implements Logger {
  log(message: string, ...meta: unknown[]): void {
    console.log(message, ...meta);
  }

  error(message: string, ...meta: unknown[]): void {
    console.error(message, ...meta);
  }
}
