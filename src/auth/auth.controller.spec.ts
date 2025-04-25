import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import * as uuidUtils from './../utils/uuid-utils';
import * as queryString from 'querystring';
import { AuthService } from './auth.service';
import {
  mockAuthService,
  mockConfigService,
  mockHandleService,
  mockEnvVariables,
  mockStatsService,
} from 'src/__mocks__/mock-services';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import { StatsService } from 'src/stats/stats.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAccessTokenError,
  mockAccessTokenResponse,
  mockAuthLog,
  mockAxiosError,
  mockDataUpdate,
  mockQueryCreateAuth,
  mockQueryError,
  mockQueryGetId,
  mockQueryParamsLogin,
  mockRes,
  mockState,
  mockUpdatedAuthLog,
  mockUserId,
  mockUserProfile,
} from './__mocks__/mock-api-responses';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { HttpStatus } from '@nestjs/common';

let errorHandlerService: ErrorHandlerService;
let authService: AuthService;
let controller: AuthController;

describe('Auth Controller', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthController,
        { provide: AuthService, useValue: mockAuthService },
        { provide: StatsService, useValue: mockStatsService },
        { provide: ErrorHandlerService, useValue: mockHandleService },
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
    errorHandlerService = module.get<ErrorHandlerService>(ErrorHandlerService);
    authService = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[login] success', async () => {
    jest.spyOn(uuidUtils, 'generateShortUUID').mockReturnValue(mockState);

    const result = await controller.login();

    const urlMock = {
      url: `${mockEnvVariables.spotifyApi.hostAccountsApiSpotify}/authorize?${queryString.stringify(mockQueryParamsLogin)}`,
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

    await controller.authCallBack(mockQueryCreateAuth, mockRes as any);

    expect(mockAuthService.createNewLog).toHaveBeenCalledWith(
      mockQueryCreateAuth,
    );
    expect(mockAuthService.createUserToken).toHaveBeenCalledWith(mockAuthLog);
    expect(mockStatsService.getUserProfile).toHaveBeenCalledWith(
      mockAccessTokenResponse.data.access_token,
    );

    expect(mockAuthService.updateLog).toHaveBeenCalledWith(
      mockAuthLog.id,
      mockDataUpdate,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(
      HttpStatus.MOVED_PERMANENTLY,
      `${mockEnvVariables.hostFrontEnd}/${mockUpdatedAuthLog.usernameId}`,
    );
  });

  it('[callback] querys with errors', async () => {
    await controller.authCallBack(mockQueryError as any, mockRes as any);

    expect(mockRes.redirect).toHaveBeenCalledWith(
      HttpStatus.MOVED_PERMANENTLY,
      `${mockEnvVariables.hostFrontEnd}/login-error?info=state_mismatch`,
    );
  });

  it('[callback] querys with no code', async () => {
    await controller.authCallBack(mockQueryError, mockRes as any);

    expect(mockRes.redirect).toHaveBeenCalledWith(
      HttpStatus.MOVED_PERMANENTLY,
      `${mockEnvVariables.hostFrontEnd}/login-error?info=${mockQueryError.error}`,
    );
  });

  it('[callback] error auth callback', async () => {
    jest
      .spyOn(authService, 'createNewLog')
      .mockRejectedValue(mockAccessTokenError);

    await controller.authCallBack(mockQueryCreateAuth, mockRes as any);
    expect(errorHandlerService.handleError).toHaveBeenCalledWith(
      mockAccessTokenError,
    );
  });

  it('[token/refresh] success', async () => {
    jest
      .spyOn(authService, 'updateAuthToken')
      .mockResolvedValue(mockUpdatedAuthLog);

    const result = await controller.refreshTokenById(mockQueryGetId);

    expect(authService.updateAuthToken).toHaveBeenCalledWith(mockQueryGetId.id);
    expect(result).toEqual(mockUpdatedAuthLog);
  });

  it('[token/refresh] error', async () => {
    jest
      .spyOn(authService, 'updateAuthToken')
      .mockRejectedValue(mockAxiosError);

    await controller.refreshTokenById(mockQueryGetId);

    expect(errorHandlerService.handleError).toHaveBeenCalledWith(
      mockAxiosError,
    );
  });

  it('[get-log] success', async () => {
    jest.spyOn(authService, 'getAuthLog').mockResolvedValue(mockAuthLog);

    const result = await controller.getAuthLog(mockQueryGetId);
    expect(result).toEqual(mockAuthLog);
  });

  it('[get-log] error', async () => {
    jest.spyOn(authService, 'getAuthLog').mockRejectedValue(mockAxiosError);

    await controller.getAuthLog(mockQueryGetId);

    expect(errorHandlerService.handleError).toHaveBeenCalledWith(
      mockAxiosError,
    );
  });

  it('[get-log-userid] success', async () => {
    jest
      .spyOn(authService, 'getAuthLogByUserId')
      .mockResolvedValue(mockAuthLog);

    const result = await controller.getAuthLogByUserId(mockUserId);
    expect(result).toEqual(mockAuthLog);
  });

  it('[get-log-userid] error', async () => {
    jest
      .spyOn(authService, 'getAuthLogByUserId')
      .mockRejectedValue(mockAxiosError);

    await controller.getAuthLogByUserId(mockUserId);

    expect(errorHandlerService.handleError).toHaveBeenCalledWith(
      mockAxiosError,
    );
  });

  it('[logout] success', async () => {
    jest.spyOn(authService, 'deleteAuthLog').mockResolvedValue(mockAuthLog);

    const result = await controller.logout(mockQueryGetId);
    expect(result).toEqual(mockAuthLog);
  });

  it('[logout] error', async () => {
    jest.spyOn(authService, 'deleteAuthLog').mockRejectedValue(mockAxiosError);

    await controller.logout(mockQueryGetId);

    expect(errorHandlerService.handleError).toHaveBeenCalledWith(
      mockAxiosError,
    );
  });
});
