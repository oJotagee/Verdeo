import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { DatabaseService } from '../database/database.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'packages/config/.env',
    }),
  ],
  controllers: [AppController],
  providers: [DatabaseService],
})
export class AppModule {}
