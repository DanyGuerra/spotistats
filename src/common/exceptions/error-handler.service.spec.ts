import { Test, TestingModule } from '@nestjs/testing';
import { ErrorHandlerService } from './error-handler.service';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';

import {
  mockAxiosError,
  mockAxiosErrorBadRequest,
  mockAxiosErrorDefaulMessage,
  mockAxiosErrorDefault,
  mockAxiosErrorNoResponse,
  mockError,
} from 'src/__mocks__/mock-api-responses';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('Error handler servide', () => {
  let serviceErrorhandler: ErrorHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: getLoggerToken(ErrorHandlerService.name),
          useValue: loggerMock,
        },
      ],
    }).compile();

    serviceErrorhandler = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it('Should be defined', () => {
    expect(serviceErrorhandler).toBeDefined();
  });

  it('should throw UnauthorizedException for AxiosError with 401 status', () => {
    expect(() => serviceErrorhandler.handleError(mockAxiosError)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw BadRequestException for AxiosError with 400 status', () => {
    expect(() =>
      serviceErrorhandler.handleError(mockAxiosErrorBadRequest),
    ).toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException for AxiosError with 500 status', () => {
    expect(() =>
      serviceErrorhandler.handleError(mockAxiosErrorDefault),
    ).toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException for AxiosError with no response', () => {
    expect(() =>
      serviceErrorhandler.handleError(mockAxiosErrorNoResponse),
    ).toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException for AxiosError default status and message', () => {
    expect(() =>
      serviceErrorhandler.handleError(mockAxiosErrorDefaulMessage),
    ).toThrow(InternalServerErrorException);
  });

  it('should throw error for no AxiosError', () => {
    expect(() => serviceErrorhandler.handleError(mockError)).toThrow(mockError);
  });
});
