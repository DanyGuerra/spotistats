import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { getLoggerToken } from 'nestjs-pino';
import { of, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import {
  mockAccessTokenResponse,
  mockHostApiSpotify,
  mockUrlEncodedData,
  mockAccessTokenError,
  mockResponseData,
  mockAuthLog,
  mockRequestToken,
  mockUriCallback,
  mockUserId,
} from './__mocks__/mock-api-responses';
import {
  mockConfigService,
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
        { provide: ErrorHandlerService, useValue: {} },
        {
          provide: getLoggerToken(AuthService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access token response on success', async () => {
    mockHttpCustomService.post.mockReturnValue(of(mockAccessTokenResponse));

    const result = await service.apiTokenRequest(mockUrlEncodedData);

    expect(result).toEqual(mockAccessTokenResponse);
    expect(mockHttpCustomService.post).toHaveBeenCalledWith(
      mockHostApiSpotify,
      mockUrlEncodedData,
    );
  });

  it('should throw an error token response error', async () => {
    const mockAxiosError = {
      isAxiosError: true,
      response: {
        ...mockAccessTokenError,
      },
    } as AxiosError;

    mockHttpCustomService.post.mockReturnValue(
      throwError(() => mockAxiosError),
    );

    await expect(service.apiTokenRequest(mockUrlEncodedData)).rejects.toThrow();

    expect(mockHttpCustomService.post).toHaveBeenCalledWith(
      mockHostApiSpotify,
      mockUrlEncodedData,
    );
  });

  it('should save new Log Auth', async () => {
    const result = await service.createNewLog(mockCreateAuthLogDto);
    expect(mockAuthLogModel).toHaveBeenCalledWith(mockCreateAuthLogDto);
    expect(result).toEqual(mockSavedLog);
  });

  it('should create a user token and return the data', async () => {
    const apiTokenRequestMock = jest
      .spyOn(service as any, 'apiTokenRequest')
      .mockResolvedValue({ data: mockResponseData });

    (service as any).redirectUriCallback = mockUriCallback;

    const result = await service.createUserToken(mockAuthLog);

    expect(apiTokenRequestMock).toHaveBeenCalledWith(
      qs.stringify(mockRequestToken),
    );
    expect(result).toEqual(mockResponseData);
  });

  it('should update the auth log successfully', async () => {
    mockAuthLogModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedLog),
    });

    const result = await service.updateLog(mockAuthId, mockCreateAuthLogDto);

    expect(mockAuthLogModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockAuthId,
      mockCreateAuthLogDto,
      { new: true },
    );
    expect(result).toEqual(updatedLog);
  });

  it('should throw NotFoundException at findByIdAndUpdate', async () => {
    mockAuthLogModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.updateLog(idNotFound, mockCreateAuthLogDto),
    ).rejects.toThrow(NotFoundException);

    expect(mockAuthLogModel.findByIdAndUpdate).toHaveBeenCalledWith(
      idNotFound,
      mockCreateAuthLogDto,
      { new: true },
    );
  });

  it('should get the auth log successfully', async () => {
    mockAuthLogModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAuthLog),
    });

    const result = await service.getAuthLog(mockAuthId);

    expect(mockAuthLogModel.findById).toHaveBeenCalledWith(mockAuthId);
    expect(result).toEqual(mockAuthLog);
  });

  it('should throw NotFoundException at getAuthLog', async () => {
    mockAuthLogModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.getAuthLog(idNotFound)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAuthLogModel.findById).toHaveBeenCalledWith(idNotFound);
  });

  it('should get auth log by userId', async () => {
    mockAuthLogModel.findOne.mockReturnValue(
      mockReturnValueFindOne(mockAuthLog),
    );

    const result = await service.getAuthLogByUserId(mockUserId);

    expect(mockAuthLogModel.findOne).toHaveBeenCalledWith({
      usernameId: mockUserId,
    });
    expect(result).toEqual(mockAuthLog);
  });

  it('should throw NotFoundException at getAuthLog by user id', async () => {
    mockAuthLogModel.findOne.mockReturnValue(mockReturnValueFindOne(null));

    await expect(service.getAuthLogByUserId(idNotFound)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAuthLogModel.findOne).toHaveBeenCalledWith({
      usernameId: idNotFound,
    });
  });
});
