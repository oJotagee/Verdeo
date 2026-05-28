import { Result, ok, err } from 'neverthrow';

import { AuthFailure, AuthSuccess, UserDomainError } from '../errors/user-domain.error';
import { PasswordEncoder } from '../ports/password-encoder.port';
import { AggregateRoot } from '../aggregates/aggregate-root';
import { Username } from '../value-objects/username.vo';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import {
  createUserAuthenticatedEvent,
  createUserBlockedEvent,
  createUserCreatedEvent,
  createUserDeletedEvent,
  createUserDisabledEvent,
  createUserEnabledEvent,
  createUserUpdatedEvent,
} from '..';

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 60 * 60 * 1000;

export interface CreateUserProps {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  createdBy?: string;
  correlationId?: string;
}

export interface UpdateUserProps {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  updatedBy?: string;
  correlationId?: string;
}

export interface UserProps {
  username: Username;
  email: Email;
  passwordHash: string;
  fullName: string;
  phone?: string;
  active: boolean;
  blocked: boolean;
  failedLoginAttempts: number;
  blockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  disabledAt?: Date;
  disabledReason?: string;
}

export class User extends AggregateRoot<UserId> {
  private _props: UserProps;

  private constructor(id: UserId, props: UserProps) {
    super(id);
    this._props = props;
  }

  // gets
  get username(): string {
    return this._props.username.value;
  }

  get email(): string {
    return this._props.email.value;
  }

  get passwordHash(): string {
    return this._props.passwordHash;
  }

  get fullName(): string {
    return this._props.fullName;
  }

  get phone(): string | undefined {
    return this._props.phone;
  }

  get active(): boolean {
    return this._props.active;
  }

  get blocked(): boolean {
    return this._props.blocked;
  }

  get failedLoginAttempts(): number {
    return this._props.failedLoginAttempts;
  }

  get blockedUntil(): Date | undefined {
    return this._props.blockedUntil;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  get lastLoginAt(): Date | undefined {
    return this._props.lastLoginAt;
  }

  get disabledAt(): Date | undefined {
    return this._props.disabledAt;
  }

  get disabledReason(): string | undefined {
    return this._props.disabledReason;
  }

  // Cria o usuario e dispara o evento de criação
  static create(props: CreateUserProps): Result<User, UserDomainError> {
    try {
      const userId = UserId.create(props.id);
      const username = Username.create(props.username);
      const email = Email.create(props.email);
      const now = new Date();

      const user = new User(userId, {
        username,
        email,
        passwordHash: props.passwordHash,
        fullName: props.fullName,
        phone: props.phone,
        active: true,
        blocked: false,
        failedLoginAttempts: 0,
        createdAt: now,
        updatedAt: now,
      });

      user.addDomainEvent(
        createUserCreatedEvent({
          userId: userId.value,
          username: username.value,
          email: email.value,
          fullName: props.fullName,
          phone: props.phone,
          active: true,
          createdBy: props.createdBy,
          createdAt: now.toISOString(),
        }),
      );

      return ok(user);
    } catch (error) {
      return err(
        UserDomainError.validationError(
          error instanceof Error ? error.message : 'Erro ao criar usuário.',
        ),
      );
    }
  }

  static reconstitute(id: string, props: UserProps): User {
    return new User(UserId.create(id), props);
  }

  update(props: UpdateUserProps): Result<void, UserDomainError> {
    try {
      if (props.username !== undefined) this._props.username = Username.create(props.username);
      if (props.email !== undefined) this._props.email = Email.create(props.email);
      if (props.fullName !== undefined) this._props.fullName = props.fullName;
      if (props.phone !== undefined) this._props.phone = props.phone;
      this._props.updatedAt = new Date();

      this.addDomainEvent(
        createUserUpdatedEvent(
          {
            userId: this.id.value,
            username: this._props.username.value,
            email: this._props.email.value,
            fullName: this._props.fullName,
            phone: this._props.phone,
            updatedBy: props.updatedBy,
            updatedAt: this._props.updatedAt.toISOString(),
          },
          props.correlationId,
        ),
      );

      return ok(undefined);
    } catch (error) {
      return err(
        UserDomainError.validationError(
          error instanceof Error ? error.message : 'Erro ao atualizar usuário.',
        ),
      );
    }
  }

  async authenticate(
    password: string,
    encoder: PasswordEncoder,
    correlationId: string,
  ): Promise<Result<AuthSuccess, AuthFailure>> {
    if (!this._props.active) {
      return err({
        error: UserDomainError.userDisabled(),
        failedAttempts: this._props.failedLoginAttempts,
        blocked: this._props.blocked,
      });
    }

    if (this._props.blocked) {
      if (this._props.blockedUntil && this._props.blockedUntil > new Date()) {
        return err({
          error: UserDomainError.userBlocked(),
          failedAttempts: this._props.failedLoginAttempts,
          blocked: true,
        });
      }

      this._props.blocked = false;
      this._props.failedLoginAttempts = 0;
      this._props.blockedUntil = undefined;
    }

    const matches = await encoder.matches(password, this._props.passwordHash);

    if (!matches) {
      this._props.failedLoginAttempts += 1;
      this._props.updatedAt = new Date();

      if (this._props.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        this._props.blocked = true;
        this._props.blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS);

        this.addDomainEvent(
          createUserBlockedEvent(
            {
              userId: this.id.value,
              username: this._props.username.value,
              failedAttempts: this._props.failedLoginAttempts,
              blockedUntil: this._props.blockedUntil.toISOString(),
              blockedAt: new Date().toISOString(),
            },
            correlationId,
          ),
        );
      }

      return err({
        error: UserDomainError.invalidCredentials(),
        failedAttempts: this._props.failedLoginAttempts,
        blocked: this._props.blocked,
      });
    }

    const now = new Date();
    this._props.failedLoginAttempts = 0;
    this._props.lastLoginAt = now;
    this._props.updatedAt = now;

    this.addDomainEvent(
      createUserAuthenticatedEvent(
        {
          userId: this.id.value,
          username: this._props.username.value,
          authenticatedAt: now.toISOString(),
        },
        correlationId,
      ),
    );

    return ok({
      userId: this.id.value,
      userName: this._props.username.value,
      lastLoginAt: now,
    });
  }

  block(correlationId: string): Result<void, UserDomainError> {
    if (this._props.blocked) return err(UserDomainError.userAlreadyBlocked());

    const now = new Date();
    this._props.blocked = true;
    this._props.blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MS);
    this._props.updatedAt = now;

    this.addDomainEvent(
      createUserBlockedEvent(
        {
          userId: this.id.value,
          username: this._props.username.value,
          failedAttempts: this._props.failedLoginAttempts,
          blockedUntil: this._props.blockedUntil.toISOString(),
          blockedAt: now.toISOString(),
        },
        correlationId,
      ),
    );

    return ok(undefined);
  }

  disable(reason: string, correlationId: string): Result<void, UserDomainError> {
    if (!this._props.active) return err(UserDomainError.userAlreadyDisabled());

    const now = new Date();
    this._props.active = false;
    this._props.disabledAt = now;
    this._props.disabledReason = reason;
    this._props.updatedAt = now;

    this.addDomainEvent(
      createUserDisabledEvent(
        {
          userId: this.id.value,
          username: this._props.username.value,
          reason,
          disabledAt: now.toISOString(),
        },
        correlationId,
      ),
    );

    return ok(undefined);
  }

  enable(correlationId: string): Result<void, UserDomainError> {
    if (this._props.active) return err(UserDomainError.userAlreadyEnabled());

    const now = new Date();
    this._props.active = true;
    this._props.disabledAt = undefined;
    this._props.disabledReason = undefined;
    this._props.updatedAt = now;

    this.addDomainEvent(
      createUserEnabledEvent(
        {
          userId: this.id.value,
          username: this._props.username.value,
          enabledAt: now.toISOString(),
        },
        correlationId,
      ),
    );

    return ok(undefined);
  }

  delete(correlationId?: string): void {
    this.addDomainEvent(
      createUserDeletedEvent(
        {
          userId: this.id.value,
          username: this._props.username.value,
          deletedAt: new Date().toISOString(),
        },
        correlationId,
      ),
    );
  }
}
