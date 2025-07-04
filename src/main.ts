import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response-interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

export async function createApp() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const hostFrontEnd = configService.get<string>('hostFrontEnd');
  const apiContext = configService.get<string>('apiContext');

  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: hostFrontEnd || '*',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix(apiContext);

  await app.init();
  return app.getHttpAdapter().getInstance();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const hostFrontEnd = configService.get<string>('hostFrontEnd');
  const apiContext = configService.get<string>('apiContext');

  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: hostFrontEnd || '*',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix(apiContext);

  await app.listen(port);
}

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  bootstrap();
}
