import { ValidationException } from '@app/core-shared';

export class Username {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9._]{3,50}$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Username {
    if (!value || !Username.USERNAME_REGEX.test(value)) {
      throw new ValidationException(
        `Username inválido: '${value}'. Entre 3 e 50 chars alfanuméricos (ponto e underscore permitidos).`,
      );
    }

    return new Username(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Username): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
