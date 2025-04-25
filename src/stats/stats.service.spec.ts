import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import { StatsService } from './stats.service';
import {
  mockConfigService,
  mockEnvVariables,
  mockHandleService,
  mockHttpCustomService,
} from 'src/__mocks__/mock-services';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import { of } from 'rxjs';
import {
  mockAccessToken,
  mockHeaders,
  mockUserProfile,
} from './__mocks__/mock-stats';

describe('Stats service', () => {
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StatsService,
        { provide: HttpCustomService, useValue: mockHttpCustomService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: ErrorHandlerService, useValue: mockHandleService },
        {
          provide: getLoggerToken(StatsService.name),
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });
  it('should be defined ', () => {
    expect(service).toBeDefined();
  });

  it('[getUserProfile] success', async () => {
    mockHttpCustomService.get.mockReturnValue(of({ data: mockUserProfile }));

    const result = await service.getUserProfile(mockAccessToken);

    expect(mockHttpCustomService.get).toHaveBeenCalledWith(
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me`,
      mockHeaders,
    );

    expect(result).toEqual(mockUserProfile);
  });

  it('[getTopArtists] success', async () => {
    mockHttpCustomService.get.mockReturnValue(of({ data: mockUserProfile }));

    const result = await service.getUserProfile(mockAccessToken);

    expect(mockHttpCustomService.get).toHaveBeenCalledWith(
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me`,
      mockHeaders,
    );

    expect(result).toEqual(mockUserProfile);
  });
});
