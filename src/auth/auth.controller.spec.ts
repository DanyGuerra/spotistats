import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import * as uuidUtils from './../utils/uuid-utils';
import * as queryString from 'querystring';
import { AuthService } from './auth.service';
import {
  mockAuthService,
  mockConfigService,
  mockHostFrontEnd,
  mockSpotifyApiEnv,
  mockStatsService,
} from 'src/__mocks__/mock-services';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import { StatsService } from 'src/stats/stats.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAccessTokenResponse,
  mockAuthLog,
  mockDataUpdate,
  mockQuery,
  mockQueryParamsLogin,
  mockRes,
  mockState,
  mockUpdatedAuthLog,
  mockUserProfile,
} from './__mocks__/mock-api-responses';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthController,
        { provide: AuthService, useValue: mockAuthService },
        { provide: StatsService, useValue: mockStatsService },
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

  it('[callback] success auth callback and redirect', async () => {
    mockAuthService.createNewLog.mockResolvedValue(mockAuthLog);
    mockAuthService.createUserToken.mockResolvedValue(
      mockAccessTokenResponse.data,
    );
    mockStatsService.getUserProfile.mockResolvedValue(mockUserProfile);
    mockAuthService.updateLog.mockResolvedValue(mockUpdatedAuthLog);

    await controller.authCallBack(mockQuery as any, mockRes as any);

    expect(mockAuthService.createNewLog).toHaveBeenCalledWith(mockQuery);
    expect(mockAuthService.createUserToken).toHaveBeenCalledWith(mockAuthLog);
    expect(mockStatsService.getUserProfile).toHaveBeenCalledWith(
      mockAccessTokenResponse.data.access_token,
    );

    expect(mockAuthService.updateLog).toHaveBeenCalledWith(
      mockAuthLog.id,
      mockDataUpdate,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(
      301,
      `${mockHostFrontEnd}/${mockUpdatedAuthLog.usernameId}`,
    );
  });
});
