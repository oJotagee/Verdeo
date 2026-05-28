import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(params: {
    page: number;
    size: number;
    categoryId?: string;
    activeOnly?: boolean;
  }): Promise<{ products: Product[]; total: number }>;
  save(product: Product): Promise<Product>;
  saveInTransaction(product: Product): Promise<Product>;
}
