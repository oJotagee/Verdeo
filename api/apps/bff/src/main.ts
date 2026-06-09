import { NestFactory } from '@nestjs/core';

import { BffModule } from './bff.module';

async function bootstrap() {
  const app = await NestFactory.create(BffModule);
  await app.listen(process.env.PORT_BFF ?? 3000);
}
bootstrap();
