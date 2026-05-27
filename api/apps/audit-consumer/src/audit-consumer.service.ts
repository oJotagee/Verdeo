import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditConsumerService {
  getHello(): string {
    return 'Hello World!';
  }
}
