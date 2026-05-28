import { ValidationException } from '@app/core-shared';

export class Email {
  private static readonly EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    if (!value || !Email.EMAIL_REGEX.test(value.trim())) {
      throw new ValidationException(`E-mail inválido: '${value}'.`);
    }

    return new Email(value.toLowerCase().trim());
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
