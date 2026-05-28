export type ProductDomainErrorCode =
  | 'PRODUCT_INACTIVE'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_PRICE'
  | 'VALIDATION_ERROR';

export class ProductDomainError {
  constructor(
    public code: ProductDomainErrorCode,
    public message: string,
  ) {}

  static productInactive(): ProductDomainError {
    return new ProductDomainError('PRODUCT_INACTIVE', 'Produto está inativo.');
  }

  static insufficientStock(available: number, requested: number): ProductDomainError {
    return new ProductDomainError(
      'INSUFFICIENT_STOCK',
      `Estoque insuficiente. Disponível: ${available}, solicitado: ${requested}.`,
    );
  }

  static invalidPrice(value: number): ProductDomainError {
    return new ProductDomainError('INVALID_PRICE', `Preço inválido: ${value}.`);
  }

  static validationError(message: string): ProductDomainError {
    return new ProductDomainError('VALIDATION_ERROR', message);
  }
}
