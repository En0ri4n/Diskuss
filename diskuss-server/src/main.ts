import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';

// Load environment variables from .env file


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Serve /uploads folder statically
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
