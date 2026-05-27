import { Test, TestingModule } from '@nestjs/testing';
import { CoreSagaService } from './core-saga.service';

describe('CoreSagaService', () => {
  let service: CoreSagaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreSagaService],
    }).compile();

    service = module.get<CoreSagaService>(CoreSagaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
