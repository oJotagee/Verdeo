import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { ValidationException } from '../exceptions/validation.exception';
import { correlationStorage } from '../correlation/correlation.storage';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ConflictException } from '../exceptions/conflict.exception';
import { DomainException } from '../exceptions/domain.exception';
import { ErrorResponseDto } from '../dtos/error-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { statusCode, errorCode, message } = this.resolveError(exception);
    const correlationId = correlationStorage.getStore()?.correlationId;

    const body: ErrorResponseDto = {
      errorCode,
      message,
      correlationId,
      timestamp: new Date().toISOString(),
    };

    this.logger.error({ statusCode, errorCode, message, correlationId });
    response.status(statusCode).json(body);
  }

  private resolveError(exception: unknown): {
    statusCode: number;
    errorCode: string;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      const message =
        typeof res === 'object' && res !== null && 'message' in res
          ? String((res as Record<string, unknown>).message)
          : exception.message;

      const errorCode =
        typeof res === 'object' && res !== null && 'error' in res
          ? String((res as Record<string, unknown>).error)
          : (HttpStatus[status] ?? 'HTTP_ERROR');

      return { statusCode: status, errorCode, message };
    }

    if (exception instanceof ValidationException) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: exception.errorCode,
        message: exception.message,
      };
    }

    if (exception instanceof NotFoundException) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: exception.errorCode,
        message: exception.message,
      };
    }

    if (exception instanceof ConflictException) {
      return {
        statusCode: HttpStatus.CONFLICT,
        errorCode: exception.errorCode,
        message: exception.message,
      };
    }

    if (exception instanceof ForbiddenException) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: exception.errorCode,
        message: exception.message,
      };
    }

    if (exception instanceof DomainException) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorCode: exception.errorCode,
        message: exception.message,
      };
    }

    const error = exception as Error;
    this.logger.error('Erro inesperado:', error?.stack ?? String(exception));

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
    };
  }
}
