import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { getLoggerToken } from 'nestjs-pino';
import { of } from 'rxjs';
import {
  mockAccessTokenResponse,
  mocAccountApiSpotify,
  mockUrlEncodedData,
  mockResponseData,
  mockAuthLog,
  mockRequestToken,
  mockUriCallback,
  mockUserId,
  mockUpdatedAuthLog,
} from '../__mocks__/mock-api-responses';
import {
  mockConfigService,
  mockHandleService,
  mockHttpCustomService,
} from 'src/__mocks__/mock-services';
import {
  mockAuthId,
  idNotFound,
  mockAuthLogModel,
  mockCreateAuthLogDto,
  mockSavedLog,
  updatedLog,
  mockReturnValueFindOne,
} from 'src/__mocks__/mock-models';
import * as qs from 'qs';
import { NotFoundException } from '@nestjs/common';
import { loggerMock } from 'src/__mocks__/mock-logger';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: getModelToken(AuthLog.name),
          useValue: mockAuthLogModel,
        },
        { provide: HttpCustomService, useValue: mockHttpCustomService },
        { provide: ErrorHandlerService, useValue: mockHandleService },
        {
          provide: getLoggerToken(AuthService.name),
          useValue: loggerMock,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('AuthService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('[apiTokenRequest] should return access token', async () => {
    mockHttpCustomService.post.mockReturnValue(of(mockAccessTokenResponse));

    const result = await service.apiTokenRequest(mockUrlEncodedData);

    expect(result).toEqual(mockAccessTokenResponse);
    expect(mockHttpCustomService.post).toHaveBeenCalledWith(
      mocAccountApiSpotify,
      mockUrlEncodedData,
    );
  });

  it('[createNewLog] should save new Log Auth', async () => {
    const result = await service.createNewLog(mockCreateAuthLogDto);
    expect(loggerMock.info).toHaveBeenCalledWith('Starting create new log...');
    expect(loggerMock.info).toHaveBeenCalledWith('End create new log');
    expect(mockAuthLogModel).toHaveBeenCalledWith(mockCreateAuthLogDto);
    expect(result).toEqual(mockSavedLog);
  });

  it('[createUserToken] should create a user token', async () => {
    const apiTokenRequestMock = jest
      .spyOn(service as any, 'apiTokenRequest')
      .mockResolvedValue({ data: mockResponseData });

    (service as any).redirectUriCallback = mockUriCallback;

    const result = await service.createUserToken(mockAuthLog);

    expect(loggerMock.info).toHaveBeenCalledWith(
      'Starting create user token...',
    );
    expect(loggerMock.info).toHaveBeenCalledWith('End create user token...');
    expect(apiTokenRequestMock).toHaveBeenCalledWith(
      qs.stringify(mockRequestToken),
    );
    expect(result).toEqual(mockResponseData);
  });

  it('[updateLog] should update the auth log', async () => {
    mockAuthLogModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedLog),
    });

    const result = await service.updateLog(mockAuthId, mockCreateAuthLogDto);

    expect(loggerMock.info).toHaveBeenCalledWith('Starting update log...');
    expect(loggerMock.info).toHaveBeenCalledWith('Ending update log...');
    expect(mockAuthLogModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockAuthId,
      mockCreateAuthLogDto,
      { new: true },
    );
    expect(result).toEqual(updatedLog);
  });

  it('[updateLog] should throw NotFoundException at findByIdAndUpdate', async () => {
    mockAuthLogModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.updateLog(idNotFound, mockCreateAuthLogDto),
    ).rejects.toThrow(NotFoundException);

    expect(loggerMock.error).toHaveBeenCalledWith('Log not found');
    expect(mockAuthLogModel.findByIdAndUpdate).toHaveBeenCalledWith(
      idNotFound,
      mockCreateAuthLogDto,
      { new: true },
    );
  });

  it('[getAuthLog] should get the auth log', async () => {
    mockAuthLogModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAuthLog),
    });

    const result = await service.getAuthLog(mockAuthId);

    expect(loggerMock.info).toHaveBeenCalledWith('Starting get AuthLog...');
    expect(loggerMock.info).toHaveBeenCalledWith('End get AuthLog...');
    expect(mockAuthLogModel.findById).toHaveBeenCalledWith(mockAuthId);
    expect(result).toEqual(mockAuthLog);
  });

  it('[getAuthLog] should throw NotFoundException at findById', async () => {
    mockAuthLogModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.getAuthLog(idNotFound)).rejects.toThrow(
      NotFoundException,
    );

    expect(loggerMock.error).toHaveBeenCalledWith('Log not found');
    expect(mockAuthLogModel.findById).toHaveBeenCalledWith(idNotFound);
  });

  it('[getAuthLogByUserId] should get auth log by userId', async () => {
    mockAuthLogModel.findOne.mockReturnValue(
      mockReturnValueFindOne(mockAuthLog),
    );

    const result = await service.getAuthLogByUserId(mockUserId);

    expect(mockAuthLogModel.findOne).toHaveBeenCalledWith({
      usernameId: mockUserId,
    });
    expect(result).toEqual(mockAuthLog);
  });

  it('[getAuthLogByUserId] should throw NotFoundException at findOne', async () => {
    mockAuthLogModel.findOne.mockReturnValue(mockReturnValueFindOne(null));

    await expect(service.getAuthLogByUserId(idNotFound)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAuthLogModel.findOne).toHaveBeenCalledWith({
      usernameId: idNotFound,
    });
  });

  it('[updateAuthToken] should update auth token', async () => {
    jest.spyOn(service, 'getAuthLog').mockResolvedValue(mockAuthLog);

    jest
      .spyOn(service, 'apiTokenRequest')
      .mockResolvedValue(mockAccessTokenResponse);

    mockAuthLogModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUpdatedAuthLog),
    });

    const result = await service.updateAuthToken(mockAuthId);

    expect(service.getAuthLog).toHaveBeenCalledWith(mockAuthId);
    expect(service.apiTokenRequest).toHaveBeenCalled();
    expect(mockAuthLogModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockAuthId,
      {
        accessToken: mockAccessTokenResponse.data.access_token,
      },
    );
    expect(result).toEqual(mockUpdatedAuthLog);
  });

  it('[updateAuthToken] should throw an error NotFoundException at findByIdAndUpdate', async () => {
    jest.spyOn(service, 'getAuthLog').mockResolvedValue(mockAuthLog);

    jest
      .spyOn(service, 'apiTokenRequest')
      .mockResolvedValue(mockAccessTokenResponse);

    mockAuthLogModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.updateAuthToken(idNotFound)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAuthLogModel.findByIdAndUpdate).toHaveBeenCalledWith(
      idNotFound,
      { accessToken: mockAccessTokenResponse.data.access_token },
    );
  });

  it('[deleteAuthLog] should delete the auth log', async () => {
    mockAuthLogModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAuthId),
    });

    const result = await service.deleteAuthLog(mockAuthId);

    expect(mockAuthLogModel.findByIdAndDelete).toHaveBeenCalledWith(mockAuthId);
    expect(result).toEqual(mockAuthId);
  });

  it('[deleteAuthLog] should throw NotFoundException at findByIdAndDelete', async () => {
    mockAuthLogModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.deleteAuthLog(idNotFound)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAuthLogModel.findByIdAndDelete).toHaveBeenCalledWith(idNotFound);
  });
});
