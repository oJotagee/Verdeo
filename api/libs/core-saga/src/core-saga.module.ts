import { Module } from '@nestjs/common';
import { CoreSagaService } from './core-saga.service';

@Module({
  providers: [CoreSagaService],
  exports: [CoreSagaService],
})
export class CoreSagaModule {}
