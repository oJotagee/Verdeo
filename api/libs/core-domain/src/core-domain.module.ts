import { Module } from '@nestjs/common';
import { CoreDomainService } from './core-domain.service';

@Module({
  providers: [CoreDomainService],
  exports: [CoreDomainService],
})
export class CoreDomainModule {}
