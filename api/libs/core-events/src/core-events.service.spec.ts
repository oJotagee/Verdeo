import { Test, TestingModule } from '@nestjs/testing';
import { CoreEventsService } from './core-events.service';

describe('CoreEventsService', () => {
  let service: CoreEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreEventsService],
    }).compile();

    service = module.get<CoreEventsService>(CoreEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
