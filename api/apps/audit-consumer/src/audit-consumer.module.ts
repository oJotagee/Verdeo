import { Module } from '@nestjs/common';
import { AuditConsumerController } from './audit-consumer.controller';
import { AuditConsumerService } from './audit-consumer.service';

@Module({
  imports: [],
  controllers: [AuditConsumerController],
  providers: [AuditConsumerService],
})
export class AuditConsumerModule {}
