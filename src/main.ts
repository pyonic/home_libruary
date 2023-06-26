import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CustomLoggerService } from './modules/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const loggerService = new CustomLoggerService();

  loggerService.catchUncaughtExceptions();
  loggerService.catchUnhandledRejections();

  // To check below handlers

  // setTimeout(() => {
  //   throw new Error('Oops!');
  // }, 5000);

  // setTimeout(() => {
  //   Promise.reject(new Error('Promise oops!'))
  // }, 3000);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Assignment: REST Service')
    .setVersion('1.0')
    .addTag('Favorites')
    .addTag('Albums')
    .addTag('Tracks')
    .addTag('User')
    .addTag('Artists')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
