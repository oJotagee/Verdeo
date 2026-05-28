import { DomainEvent } from '../events/domain-events.interface';

export abstract class AggregateRoot<TId> {
  private readonly _domainEvents: DomainEvent[] = [];

  protected constructor(protected readonly _id: TId) {}

  get id(): TId {
    return this._id;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }

  get domainEvents(): readonly DomainEvent[] {
    return Object.freeze([...this._domainEvents]);
  }
}
