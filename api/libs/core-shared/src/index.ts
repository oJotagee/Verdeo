// Exceções de domínio
export { UnprocessableEntityException } from './exceptions/unprocessable-entity.exception';
export { ValidationException } from './exceptions/validation.exception';
export { ForbiddenException } from './exceptions/forbidden.exception';
export { NotFoundException } from './exceptions/not-found.exception';
export { ConflictException } from './exceptions/conflict.exception';
export { DomainException } from './exceptions/domain.exception';

// DTOs base
export { ErrorResponseDto } from './dtos/error-response.dto';
export { PageResponseDto } from './dtos/page-response.dto';
export { PageRequestDto } from './dtos/page-request.dto';

// Correlação
export { correlationStorage, CorrelationContext } from './correlation/correlation.storage';

// Constantes de autenticação
export { TOKEN_PAYLOAD } from './constant/auth.constant';

// Decorators e params
export { TokenPayload } from './params/token.param';
export { RequirePermission, PERMISSION_KEY } from './decorators/require-permission.decorator';
export type {
  RequiredPermission,
  PermissionAction,
} from './decorators/require-permission.decorator';

// Guards
export { PermissionGuard } from './guards/permission.guard';

// Filtros
export { GlobalExceptionFilter } from './filters/global-exception.filter';

// Módulo
export { SharedModule } from './shared.module';

// Mail
export { SmtpConfigPort, SmtpConfig, SMTP_CONFIG_PORT } from './mail/smtp-config.port';
export { NodemailerMailAdapter } from './mail/nodemailer-mail.adapter';
export { MockMailAdapter } from './mail/mock-mail.adapter';
export { MailPort, MAIL_PORT } from './mail/mail.port';
