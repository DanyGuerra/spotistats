import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response-interceptor/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { Reflector } from '@nestjs/core';

describe('Main Application ', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = app.get(ConfigService);

    const hostFrontEnd = configService.get<string>('hostFrontEnd');

    app.useLogger(app.get(Logger));
    app.enableCors({
      origin: [hostFrontEnd],
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

    app.setGlobalPrefix(configService.get<string>('apiContext'));
    await app.init();
  });

  it('should initialize the application with CORS settings', () => {
    const corsOptions = app
      .getHttpAdapter()
      .getInstance()
      ._router.stack.find((layer) => layer.name === 'corsMiddleware');
    expect(corsOptions).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
