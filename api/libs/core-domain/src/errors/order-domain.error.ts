export type OrderDomainErrorCode =
  | 'ORDER_ALREADY_CANCELLED'
  | 'ORDER_ALREADY_DELIVERED'
  | 'ORDER_EMPTY'
  | 'INVALID_STATUS_TRANSITION'
  | 'VALIDATION_ERROR';

export class OrderDomainError {
  constructor(
    public code: OrderDomainErrorCode,
    public message: string,
  ) {}

  static orderAlreadyCancelled(): OrderDomainError {
    return new OrderDomainError('ORDER_ALREADY_CANCELLED', 'Pedido já está cancelado.');
  }

  static orderAlreadyDelivered(): OrderDomainError {
    return new OrderDomainError('ORDER_ALREADY_DELIVERED', 'Pedido já foi entregue.');
  }

  static orderEmpty(): OrderDomainError {
    return new OrderDomainError('ORDER_EMPTY', 'O pedido não pode estar vazio.');
  }

  static invalidStatusTransition(from: string, to: string): OrderDomainError {
    return new OrderDomainError(
      'INVALID_STATUS_TRANSITION',
      `Transição de status inválida: ${from} -> ${to}.`,
    );
  }

  static validationError(message: string): OrderDomainError {
    return new OrderDomainError('VALIDATION_ERROR', message);
  }
}
