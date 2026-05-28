import { Order } from '../entities/order.entity';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(
    userId: string,
    params: { page: number; size: number },
  ): Promise<{ orders: Order[]; total: number }>;
  save(order: Order): Promise<Order>;
  saveInTransaction(order: Order): Promise<Order>;
}
