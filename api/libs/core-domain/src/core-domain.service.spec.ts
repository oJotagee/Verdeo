import { Test, TestingModule } from '@nestjs/testing';
import { CoreDomainService } from './core-domain.service';

describe('CoreDomainService', () => {
  let service: CoreDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreDomainService],
    }).compile();

    service = module.get<CoreDomainService>(CoreDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
