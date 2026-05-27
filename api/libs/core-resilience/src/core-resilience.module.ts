import { Module } from '@nestjs/common';
import { CoreResilienceService } from './core-resilience.service';

@Module({
  providers: [CoreResilienceService],
  exports: [CoreResilienceService],
})
export class CoreResilienceModule {}
