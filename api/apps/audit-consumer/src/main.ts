import { NestFactory } from '@nestjs/core';
import { AuditConsumerModule } from './audit-consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(AuditConsumerModule);
  await app.listen(process.env.PORT_AUDIT ?? 8085);
}
bootstrap();
