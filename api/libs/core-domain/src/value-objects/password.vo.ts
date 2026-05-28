import { ValidationException } from '@app/core-shared';

export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly UPPERCASE_REGEX = /[A-Z]/;
  private static readonly LOWERCASE_REGEX = /[a-z]/;
  private static readonly NUMBER_REGEX = /[0-9]/;
  private static readonly SPECIAL_REGEX = /[!@#$%^&*]/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Password {
    const errors: string[] = [];

    if (!value || value.length < Password.MIN_LENGTH)
      errors.push(`mínimo ${Password.MIN_LENGTH} chars`);

    if (!Password.UPPERCASE_REGEX.test(value)) errors.push('1 maiúscula');

    if (!Password.LOWERCASE_REGEX.test(value)) errors.push('1 minúscula');

    if (!Password.NUMBER_REGEX.test(value)) errors.push('1 número');

    if (!Password.SPECIAL_REGEX.test(value)) errors.push('1 especial (!@#$%^&*)');

    if (errors.length > 0) {
      throw new ValidationException(`Senha inválida. Requisitos: ${errors.join(', ')}.`);
    }

    return new Password(value);
  }

  get value(): string {
    return this._value;
  }
}
