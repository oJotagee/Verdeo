import { Test, TestingModule } from '@nestjs/testing';
import { AuditConsumerController } from './audit-consumer.controller';
import { AuditConsumerService } from './audit-consumer.service';

describe('AuditConsumerController', () => {
  let auditConsumerController: AuditConsumerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditConsumerController],
      providers: [AuditConsumerService],
    }).compile();

    auditConsumerController = app.get<AuditConsumerController>(AuditConsumerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(auditConsumerController.getHello()).toBe('Hello World!');
    });
  });
});
