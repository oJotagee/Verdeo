import { NestFactory } from '@nestjs/core';

import { UserApiModule } from './user-api.module';

async function bootstrap() {
  const app = await NestFactory.create(UserApiModule);
  await app.listen(process.env.PORT_USER ?? 3000);
}
bootstrap();
