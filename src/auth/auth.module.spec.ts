import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { StatsService } from 'src/stats/stats.service';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import {
  mockAuthService,
  mockConfigService,
  mockHandleService,
  mockHttpCustomService,
  mockStatsService,
} from 'src/__mocks__/mock-services';
import { ConfigService } from '@nestjs/config';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import { getModelToken } from '@nestjs/mongoose';
import { AuthLog } from './auth-logs.schema';
import { mockAuthLogModel } from 'src/__mocks__/mock-models';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: getModelToken(AuthLog.name),
          useValue: mockAuthLogModel,
        },
        { provide: AuthService, useValue: mockAuthService },
        { provide: StatsService, useValue: mockStatsService },
        { provide: ErrorHandlerService, useValue: mockHandleService },
        { provide: HttpCustomService, useValue: mockHttpCustomService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getLoggerToken(AuthService.name),
          useValue: loggerMock,
        },
      ],
    }).compile();
  });

  it('should be defined', () => {});
});
