// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, Content-Security-Policy',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setViewEngine('ejs');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nest-js Swagger Example API')
    .setDescription('Swagger Example API API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();