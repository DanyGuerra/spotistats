import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response-interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

export async function createNestServer() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const apiContext = configService.get<string>('apiContext');
  const hostFrontEnd = configService.get<string>('hostFrontEnd');

  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: hostFrontEnd,
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

  return { app, port };
}

async function bootstrap() {
  const { app, port } = await createNestServer();
  await app.listen(port);
}

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  bootstrap();
}
