import { Result, ok, err } from 'neverthrow';

import { createProductCreatedEvent, createProductUpdatedEvent } from '../events/product-events';
import { createProductDeactivatedEvent, createProductStockDecreasedEvent } from '..';
import { ProductDomainError } from '../errors/product-domain.error';
import { StockQuantity } from '../value-objects/stock-quantity.vo';
import { AggregateRoot } from '../aggregates/aggregate-root';
import { ProductId } from '../value-objects/product-id.vo';
import { Price } from '../value-objects/price.vo';

export interface CreateProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdBy?: string;
  correlationId?: string;
}

export interface UpdateProductProps {
  name?: string;
  description?: string;
  price?: number;
  updatedBy?: string;
  correlationId?: string;
}

export interface ProductProps {
  name: string;
  description: string;
  price: Price;
  stockQuantity: StockQuantity;
  categoryId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot<ProductId> {
  private _props: ProductProps;

  private constructor(id: ProductId, props: ProductProps) {
    super(id);
    this._props = props;
  }

  get name(): string {
    return this._props.name;
  }

  get description(): string {
    return this._props.description;
  }

  get price(): Price {
    return this._props.price;
  }

  get stockQuantity(): StockQuantity {
    return this._props.stockQuantity;
  }

  get categoryId(): string {
    return this._props.categoryId;
  }

  get active(): boolean {
    return this._props.active;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  static create(props: CreateProductProps): Result<Product, ProductDomainError> {
    try {
      const productId = ProductId.create(props.id);
      const price = Price.create(props.price);
      const stockQuantity = StockQuantity.create(props.stockQuantity);
      const now = new Date();

      const product = new Product(productId, {
        name: props.name,
        description: props.description,
        price,
        stockQuantity,
        categoryId: props.categoryId,
        active: true,
        createdAt: now,
        updatedAt: now,
      });

      product.addDomainEvent(
        createProductCreatedEvent(
          {
            productId: productId.value,
            name: props.name,
            price: price.value,
            stockQuantity: stockQuantity.value,
            categoryId: props.categoryId,
            createdBy: props.createdBy,
            createdAt: now.toISOString(),
          },
          props.correlationId,
        ),
      );

      return ok(product);
    } catch (error) {
      return err(
        ProductDomainError.validationError(
          error instanceof Error ? error.message : 'Erro ao criar produto.',
        ),
      );
    }
  }

  static reconstitute(id: string, props: ProductProps): Product {
    return new Product(ProductId.create(id), props);
  }

  update(props: UpdateProductProps): Result<void, ProductDomainError> {
    try {
      if (props.name !== undefined) this._props.name = props.name;
      if (props.description !== undefined) this._props.description = props.description;
      if (props.price !== undefined) this._props.price = Price.create(props.price);
      this._props.updatedAt = new Date();

      this.addDomainEvent(
        createProductUpdatedEvent({
          productId: this.id.value,
          name: this._props.name,
          price: this._props.price.value,
          updatedBy: props.updatedBy,
          updatedAt: this._props.updatedAt.toISOString(),
        }),
      );

      return ok(undefined);
    } catch (error) {
      return err(
        ProductDomainError.validationError(
          error instanceof Error ? error.message : 'Erro ao atualizar produto.',
        ),
      );
    }
  }

  decreaseStock(quantity: number, correlationId?: string): Result<void, ProductDomainError> {
    try {
      this._props.stockQuantity = this._props.stockQuantity.decrease(quantity);
      this._props.updatedAt = new Date();

      this.addDomainEvent(
        createProductStockDecreasedEvent(
          {
            productId: this.id.value,
            quantityDecreased: quantity,
            remainingQuantity: this._props.stockQuantity.value,
            occurredAt: this._props.updatedAt.toISOString(),
          },
          correlationId,
        ),
      );

      return ok(undefined);
    } catch (error) {
      return err(
        error instanceof ProductDomainError
          ? error
          : ProductDomainError.validationError(String(error)),
      );
    }
  }

  deactivate(correlationId?: string): Result<void, ProductDomainError> {
    this._props.active = false;
    this._props.updatedAt = new Date();

    this.addDomainEvent(
      createProductDeactivatedEvent(
        {
          productId: this.id.value,
          name: this._props.name,
          deactivatedAt: this._props.updatedAt.toISOString(),
        },
        correlationId,
      ),
    );

    return ok(undefined);
  }
}
