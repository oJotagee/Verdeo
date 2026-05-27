import { Test, TestingModule } from '@nestjs/testing';
import { CoreCqrsService } from './core-cqrs.service';

describe('CoreCqrsService', () => {
  let service: CoreCqrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreCqrsService],
    }).compile();

    service = module.get<CoreCqrsService>(CoreCqrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
