import { Module } from '@nestjs/common';
import { CoreSharedService } from './core-shared.service';

@Module({
  providers: [CoreSharedService],
  exports: [CoreSharedService],
})
export class CoreSharedModule {}
