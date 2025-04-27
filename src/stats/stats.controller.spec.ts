import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { AuthService } from 'src/auth/auth.service';
import {
  mockAuthService,
  mockConfigService,
  mockHandleService,
  mockStatsService,
} from 'src/__mocks__/mock-services';
import { StatsService } from './stats.service';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';

let controller: StatsController;

describe('Auth controller', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StatsController,
        { provide: AuthService, useValue: mockAuthService },
        { provide: StatsService, useValue: mockStatsService },
        { provide: ErrorHandlerService, useValue: mockHandleService },
        {
          provide: getLoggerToken(StatsController.name),
          useValue: loggerMock,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
