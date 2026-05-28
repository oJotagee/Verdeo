import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { correlationStorage } from '../correlation/correlation.storage';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url } = request;
    const correlationId = correlationStorage.getStore()?.correlationId;
    const startTime = Date.now();

    this.logger.log({ message: 'Requisição recebida', method, url, correlationId });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log({
            message: 'Requisição concluída',
            method,
            url,
            statusCode: response.statusCode,
            correlationId,
            durationMs: duration,
          });
        },
        error: (err: unknown) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode >= 400 ? response.statusCode : 500;
          this.logger.error({
            message: 'Requisição com erro',
            method,
            url,
            statusCode,
            correlationId,
            durationMs: duration,
            error: err instanceof Error ? err.message : String(err),
          });
        },
      }),
    );
  }
}
