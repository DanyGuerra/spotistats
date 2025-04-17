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
} from '../__mocks__/mock-api-responses';
import { mockAuthLogModel } from 'src/__mocks__/mock-models';
import {
  mockConfigService,
  mockHttpCustomService,
} from 'src/__mocks__/mock-services';

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

  it('should throw an error when the request fails', async () => {
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
});
