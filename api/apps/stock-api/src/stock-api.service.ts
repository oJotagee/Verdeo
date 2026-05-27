import { Injectable } from '@nestjs/common';

@Injectable()
export class StockApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
