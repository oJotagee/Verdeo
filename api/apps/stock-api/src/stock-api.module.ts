import { Module } from '@nestjs/common';
import { StockApiController } from './stock-api.controller';
import { StockApiService } from './stock-api.service';

@Module({
  imports: [],
  controllers: [StockApiController],
  providers: [StockApiService],
})
export class StockApiModule {}
