import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    // origin: 'http://localhost:4000', 
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true, // This allows cookies to be sent in cross-origin requests
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/atari-pong/v1');
  const port = 3000;
  await app.listen(port);
}
bootstrap();
