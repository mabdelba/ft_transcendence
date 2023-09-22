import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/atari-pong/v1');
  const config = new DocumentBuilder().setTitle('Atari Pong Application')
                      .setDescription("AtariPong API Application")
                      .setVersion('v1')
                      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/atari-pong/v1', app, document);
  const port = 3000;
  await app.listen(port);
}
bootstrap();
