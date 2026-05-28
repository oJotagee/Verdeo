import { ValidationException } from '@app/core-shared';

export class OrderId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  private constructor(private readonly _value: string) {}

  static create(value: string): OrderId {
    if (!value || !OrderId.UUID_REGEX.test(value)) {
      throw new ValidationException(`OrderId inválido: '${value}'.`);
    }

    return new OrderId(value.toLowerCase());
  }

  get value(): string {
    return this._value;
  }

  equals(other: OrderId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
