import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './response-interceptor/response.interceptor';

Reflector;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  const port = configService.get<number>('PORT') || 3000;
  const apiContext = configService.get<string>('API_CONTEXT');

  app.setGlobalPrefix(apiContext);
  await app.listen(port);
}
bootstrap();
