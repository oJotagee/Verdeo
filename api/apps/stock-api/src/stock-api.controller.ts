import { Controller, Get } from '@nestjs/common';
import { StockApiService } from './stock-api.service';

@Controller()
export class StockApiController {
  constructor(private readonly stockApiService: StockApiService) {}

  @Get()
  getHello(): string {
    return this.stockApiService.getHello();
  }
}
