export type UserDomainErrorCode =
  | 'USER_ALREADY_BLOCKED'
  | 'USER_ALREADY_DISABLED'
  | 'USER_ALREADY_ENABLED'
  | 'USER_DISABLED'
  | 'USER_BLOCKED'
  | 'INVALID_CREDENTIALS'
  | 'VALIDATION_ERROR';

export class UserDomainError {
  constructor(
    public code: UserDomainErrorCode,
    public message: string,
  ) {}

  static userAlreadyBlocked(): UserDomainError {
    return new UserDomainError('USER_ALREADY_BLOCKED', 'Usuário já está bloqueado.');
  }

  static userAlreadyDisabled(): UserDomainError {
    return new UserDomainError('USER_ALREADY_DISABLED', 'Usuário já está desabilitado.');
  }

  static userAlreadyEnabled(): UserDomainError {
    return new UserDomainError('USER_ALREADY_ENABLED', 'Usuário já está habilitado.');
  }

  static userDisabled(): UserDomainError {
    return new UserDomainError('USER_DISABLED', 'Usuário está desabilitado.');
  }

  static userBlocked(): UserDomainError {
    return new UserDomainError('USER_BLOCKED', 'Usuário está bloqueado.');
  }

  static invalidCredentials(): UserDomainError {
    return new UserDomainError('INVALID_CREDENTIALS', 'Credenciais inválidas.');
  }

  static validationError(message: string): UserDomainError {
    return new UserDomainError('VALIDATION_ERROR', message);
  }
}

export interface AuthSuccess {
  userId: string;
  userName: string;
  lastLoginAt: Date;
}

export interface AuthFailure {
  error: UserDomainError;
  failedAttempts: number;
  blocked: boolean;
}
