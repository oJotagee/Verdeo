import { NestFactory } from '@nestjs/core';

import { StockApiModule } from './stock-api.module';

async function bootstrap() {
  const app = await NestFactory.create(StockApiModule);
  await app.listen(process.env.PORT_STOCK ?? 8083);
}
bootstrap();
