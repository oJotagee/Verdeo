import { Test, TestingModule } from '@nestjs/testing';
import { StockApiController } from './stock-api.controller';
import { StockApiService } from './stock-api.service';

describe('StockApiController', () => {
  let stockApiController: StockApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StockApiController],
      providers: [StockApiService],
    }).compile();

    stockApiController = app.get<StockApiController>(StockApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(stockApiController.getHello()).toBe('Hello World!');
    });
  });
});
