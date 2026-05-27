import { Module } from '@nestjs/common';
import { CoreCqrsService } from './core-cqrs.service';

@Module({
  providers: [CoreCqrsService],
  exports: [CoreCqrsService],
})
export class CoreCqrsModule {}
