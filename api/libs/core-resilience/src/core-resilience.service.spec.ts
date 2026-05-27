import { Test, TestingModule } from '@nestjs/testing';
import { CoreResilienceService } from './core-resilience.service';

describe('CoreResilienceService', () => {
  let service: CoreResilienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreResilienceService],
    }).compile();

    service = module.get<CoreResilienceService>(CoreResilienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
