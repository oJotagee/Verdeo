import { Test, TestingModule } from '@nestjs/testing';
import { CoreSharedService } from './core-shared.service';

describe('CoreSharedService', () => {
  let service: CoreSharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreSharedService],
    }).compile();

    service = module.get<CoreSharedService>(CoreSharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
