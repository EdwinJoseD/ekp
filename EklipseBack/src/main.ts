import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    //key: fs.readFileSync(join(__dirname, '../cert/certificate.pem'), 'utf8'),
    cert: fs.readFileSync(
      join(__dirname, '../certs/certificatecrt.pem'),
      'utf8'
    ),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    //httpsOptions,
  });
  const logger = new Logger();
  const port = 4000;
  initSwagger(app);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    index: false,
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  await app.listen(port);
  logger.log(`Server Running on url: ${await app.getUrl()}`);
}
bootstrap();
