import { ProductDomainError } from '../errors/product-domain.error';
import { ValidationException } from '@app/core-shared';

export class StockQuantity {
  private constructor(private readonly _value: number) {}

  static create(value: number): StockQuantity {
    if (!Number.isInteger(value) || value < 0) {
      throw new ValidationException(
        `Quantidade em estoque inválida: ${value}. Deve ser inteiro não negativo.`,
      );
    }

    return new StockQuantity(value);
  }

  get value(): number {
    return this._value;
  }

  isAvailable(quantity: number): boolean {
    return this._value >= quantity;
  }

  decrease(quantity: number): StockQuantity {
    if (quantity > this._value) {
      throw ProductDomainError.insufficientStock(this._value, quantity);
    }

    return new StockQuantity(this._value - quantity);
  }

  increase(quantity: number): StockQuantity {
    return new StockQuantity(this._value + quantity);
  }

  equals(other: StockQuantity): boolean {
    return this._value === other._value;
  }
}
