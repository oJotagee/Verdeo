import { ValidationException } from '@app/core-shared';

export class Price {
  private constructor(private readonly _cents: number) {}

  static create(value: number): Price {
    if (!Number.isFinite(value) || value < 0) {
      throw new ValidationException(`Preço inválido: ${value}. Deve ser um número não negativo.`);
    }

    return new Price(Math.round(value * 100));
  }

  static fromCents(cents: number): Price {
    return new Price(cents);
  }

  get value(): number {
    return this._cents / 100;
  }

  get cents(): number {
    return this._cents;
  }

  add(other: Price): Price {
    return new Price(this._cents + other._cents);
  }

  multiply(factor: number): Price {
    return new Price(Math.round(this._cents * factor));
  }

  equals(other: Price): boolean {
    return this._cents === other._cents;
  }

  toString(): string {
    return `R$ ${this.value.toFixed(2)}`;
  }
}
