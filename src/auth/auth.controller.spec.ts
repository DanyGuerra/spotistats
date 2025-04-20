import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import * as uuidUtils from './../utils/uuid-utils';
import * as queryString from 'querystring';
import { AuthService } from './auth.service';
import {
  mockConfigService,
  mockSpotifyApiEnv,
} from 'src/__mocks__/mock-services';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import { StatsService } from 'src/stats/stats.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockQueryParamsLogin,
  mockState,
} from './__mocks__/mock-api-responses';

describe('Auth Controller', () => {
  let controller: AuthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthController,
        { provide: AuthService, useValue: {} },
        { provide: StatsService, useValue: {} },
        {
          provide: getLoggerToken(AuthController.name),
          useValue: loggerMock,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[login] success', async () => {
    jest.spyOn(uuidUtils, 'generateShortUUID').mockReturnValue(mockState);

    const result = await controller.login();

    const urlMock = {
      url: `${mockSpotifyApiEnv.hostAccountsApiSpotify}/authorize?${queryString.stringify(mockQueryParamsLogin)}`,
    };

    expect(mockConfigService.get).toHaveBeenCalledWith('spotifyApi');
    expect(loggerMock.info).toHaveBeenCalledWith(
      'Starting auth/login route...',
    );
    expect(loggerMock.info).toHaveBeenCalledWith('End auth/login route...');
    expect(result).toEqual(urlMock);
  });
});
