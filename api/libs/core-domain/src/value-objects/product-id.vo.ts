import { ValidationException } from '@app/core-shared';

export class ProductId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  private constructor(private readonly _value: string) {}

  static create(value: string): ProductId {
    if (!value || !ProductId.UUID_REGEX.test(value)) {
      throw new ValidationException(`ProductId inválido: '${value}'.`);
    }

    return new ProductId(value.toLowerCase());
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
