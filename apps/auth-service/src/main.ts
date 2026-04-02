import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './shared/app/app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableShutdownHooks();
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Verdeo Auth Service API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const myCustom: SwaggerCustomOptions = {
    customSiteTitle: 'Swagger',
    swaggerOptions: {
      docExpansion: 'none',
      apisSorter: 'alpha',
    },
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('swagger', app, documentFactory, myCustom);

  await app.listen(process.env.PORT ?? 3001).then(() => {
    console.log(
      `Application is running on: ${process.env.API_URL ?? 'http://localhost:3001'} \nSwagger is running on: ${process.env.API_URL ?? 'http://localhost:3001'}/swagger`,
    );
  });
}
bootstrap();
