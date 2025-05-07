import {
  mockConfig,
  mockGenericData,
  mockSuccessResponse,
} from './../../__mocks__/mock-api-responses';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpCustomService } from './custom-http.service';
import { HttpService } from '@nestjs/axios';
import { mockHttpService } from 'src/__mocks__/mock-services';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import { mockUrl } from 'src/__mocks__/mock-api-responses';
import { of } from 'rxjs';

describe('Custom Http Service', () => {
  let customHttpService: HttpCustomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        HttpCustomService,
        { provide: HttpService, useValue: mockHttpService },
        {
          provide: getLoggerToken(HttpCustomService.name),
          useValue: loggerMock,
        },
      ],
    }).compile();

    customHttpService = module.get<HttpCustomService>(HttpCustomService);
  });

  it('Should be defined', () => {
    expect(customHttpService).toBeDefined();
  });

  it('[get] success', () => {
    mockHttpService.get.mockReturnValue(of(mockSuccessResponse));

    const response = customHttpService.get(mockUrl, mockConfig);

    expect(loggerMock.info).toHaveBeenCalledWith(`GET ${mockUrl}`);
    expect(loggerMock.debug).toHaveBeenCalledWith(
      `Config ${{ config: mockConfig }}`,
    );
    response.subscribe((result) => {
      expect(result).toEqual(mockSuccessResponse);
    });
  });

  it('[post] success', () => {
    mockHttpService.post.mockReturnValue(of(mockSuccessResponse));

    const response = customHttpService.post(
      mockUrl,
      mockGenericData,
      mockConfig,
    );

    expect(loggerMock.info).toHaveBeenCalledWith(`POST ${mockUrl}`);
    expect(loggerMock.debug).toHaveBeenCalledWith(
      `Config ${{ config: mockConfig }}`,
    );
    expect(loggerMock.debug).toHaveBeenCalledWith(
      `Data ${{ data: mockGenericData }}`,
    );

    response.subscribe((result) => {
      expect(result).toEqual(mockSuccessResponse);
    });
  });

  it('[put] success', () => {
    mockHttpService.put.mockReturnValue(of(mockSuccessResponse));

    const response = customHttpService.put(
      mockUrl,
      mockGenericData,
      mockConfig,
    );

    expect(loggerMock.info).toHaveBeenCalledWith(`PUT ${mockUrl}`);
    expect(loggerMock.debug).toHaveBeenCalledWith(
      `Config ${{ config: mockConfig }}`,
    );
    expect(loggerMock.debug).toHaveBeenCalledWith(
      `Data ${{ data: mockGenericData }}`,
    );

    response.subscribe((result) => {
      expect(result).toEqual(mockSuccessResponse);
    });
  });

  it('[delete] success', () => {
    mockHttpService.delete.mockReturnValue(of(mockSuccessResponse));

    const response = customHttpService.delete(mockUrl, mockConfig);

    expect(loggerMock.info).toHaveBeenCalledWith(`DELETE ${mockUrl}`);
    expect(loggerMock.debug).toHaveBeenCalledWith(
      `Config ${{ config: mockConfig }}`,
    );

    response.subscribe((result) => {
      expect(result).toEqual(mockSuccessResponse);
    });
  });
});
