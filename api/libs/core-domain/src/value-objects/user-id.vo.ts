import { ValidationException } from '@app/core-shared';

export class UserId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  private constructor(private readonly _value: string) {}

  static create(value: string): UserId {
    if (!value || !UserId.UUID_REGEX.test(value)) {
      throw new ValidationException(`UserId inválido: '${value}'. Deve ser um UUID válido.`);
    }

    return new UserId(value.toLowerCase());
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
