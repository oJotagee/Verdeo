import { Controller, Get } from '@nestjs/common';
import { AuditConsumerService } from './audit-consumer.service';

@Controller()
export class AuditConsumerController {
  constructor(private readonly auditConsumerService: AuditConsumerService) {}

  @Get()
  getHello(): string {
    return this.auditConsumerService.getHello();
  }
}
