import { Module } from '@nestjs/common';
import { CorrelationInterceptor } from './interceptors/correlation.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  providers: [CorrelationInterceptor, LoggingInterceptor],
  exports: [CorrelationInterceptor, LoggingInterceptor],
})
export class SharedModule {}
