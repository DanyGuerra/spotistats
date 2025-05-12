import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { AuthService } from 'src/auth/auth.service';
import {
  mockAuthService,
  mockConfigService,
  mockHandleService,
  mockStatsService,
} from 'src/__mocks__/mock-services';
import { StatsService } from './stats.service';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { getLoggerToken } from 'nestjs-pino';
import { loggerMock } from 'src/__mocks__/mock-logger';
import {
  createMockResponse,
  mockAuthLog,
  mockAxiosError,
  mockQueryGetId,
} from 'src/__mocks__/mock-api-responses';
import {
  mockTopArtistsParams,
  mockParamsTop,
  mockTopArtistsFormatted,
  mockUserProfile,
  mockDefaultTopArtistsParams,
  mockTopTrackFormatted,
  mockTopTracksParams,
  mockDefaultTopTracksParams,
  mockRecentlyPlayedParams,
  mockRecentlyParams,
  mockRecentlyPlayedParamsAfter,
  mockRecentlyParamsAfter,
  mockResCurrentlyPlaying,
  mockAuthLogDto,
  mockResGetCurrentlyPlaying,
} from './__mocks__/mock-stats';

let controller: StatsController;
let statsService: StatsService;
let authService: AuthService;

describe('Auth controller', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StatsController,
        { provide: AuthService, useValue: mockAuthService },
        { provide: StatsService, useValue: mockStatsService },
        { provide: ErrorHandlerService, useValue: mockHandleService },
        {
          provide: getLoggerToken(StatsController.name),
          useValue: loggerMock,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(StatsService);
    authService = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[me] shoul be return user data', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getUserProfile.mockResolvedValue(mockUserProfile);

    const result = await controller.getUserInfo(mockQueryGetId);

    expect(authService.getAuthLog).toHaveBeenCalledWith(mockQueryGetId.id);
    expect(statsService.getUserProfile).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
    );
    expect(result).toEqual(mockUserProfile);
  });

  it('[me] should throw an error', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getUserProfile.mockRejectedValue(mockAxiosError);

    await controller.getUserInfo(mockQueryGetId);
    expect(mockHandleService.handleError).toHaveBeenCalledWith(mockAxiosError);
  });

  it('[top-artists] should return top artists', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getTopArtists.mockResolvedValue(mockTopArtistsFormatted);

    const result = await controller.myTopArtist(mockTopArtistsParams);

    expect(authService.getAuthLog).toHaveBeenCalledWith(
      mockTopArtistsParams.id,
    );
    expect(statsService.getTopArtists).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
      mockParamsTop,
      mockTopArtistsParams.id,
    );

    expect(result).toEqual(mockTopArtistsFormatted);
  });

  it('[top-artists] should return top artists, called with default values', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getTopArtists.mockResolvedValue(mockTopArtistsFormatted);

    const result = await controller.myTopArtist(mockDefaultTopArtistsParams);

    expect(authService.getAuthLog).toHaveBeenCalledWith(
      mockTopArtistsParams.id,
    );
    expect(statsService.getTopArtists).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
      mockParamsTop,
      mockTopArtistsParams.id,
    );

    expect(result).toEqual(mockTopArtistsFormatted);
  });

  it('[top-artists] should throw an error', async () => {
    mockAuthService.getAuthLog.mockRejectedValue(mockAxiosError);
    await controller.myTopArtist(mockDefaultTopArtistsParams);

    expect(mockHandleService.handleError).toHaveBeenCalledWith(mockAxiosError);
  });

  it('[top-tracks] should return top tracks', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getTopTracks.mockResolvedValue(mockTopTrackFormatted);

    const result = await controller.myTopTracks(mockTopTracksParams);

    expect(authService.getAuthLog).toHaveBeenCalledWith(mockTopTracksParams.id);
    expect(statsService.getTopTracks).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
      mockParamsTop,
      mockTopTracksParams.id,
    );

    expect(result).toEqual(mockTopTrackFormatted);
  });

  it('[top-tracks] should return top tracks, called with default values', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getTopTracks.mockResolvedValue(mockTopTrackFormatted);

    const result = await controller.myTopTracks(mockDefaultTopTracksParams);

    expect(authService.getAuthLog).toHaveBeenCalledWith(mockTopTracksParams.id);
    expect(statsService.getTopTracks).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
      mockParamsTop,
      mockTopTracksParams.id,
    );

    expect(result).toEqual(mockTopTrackFormatted);
  });

  it('[top-tracks] should throw an error', async () => {
    mockAuthService.getAuthLog.mockRejectedValue(mockAxiosError);
    await controller.myTopTracks(mockTopTracksParams);

    expect(mockHandleService.handleError).toHaveBeenCalledWith(mockAxiosError);
  });

  it('[getRecentlyPlayed] should return recently played', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getRecentlyPlayed.mockResolvedValue(mockTopTrackFormatted);

    const result = await controller.getRecentlyPlayed(mockRecentlyPlayedParams);

    expect(authService.getAuthLog).toHaveBeenCalledWith(
      mockRecentlyPlayedParams.id,
    );
    expect(statsService.getRecentlyPlayed).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
      mockRecentlyParams,
      mockRecentlyPlayedParams.id,
    );

    expect(result).toEqual(mockTopTrackFormatted);
  });

  it('[getRecentlyPlayed] should return recently played, default values', async () => {
    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getRecentlyPlayed.mockResolvedValue(mockTopTrackFormatted);

    const result = await controller.getRecentlyPlayed(
      mockRecentlyPlayedParamsAfter,
    );

    expect(authService.getAuthLog).toHaveBeenCalledWith(
      mockRecentlyPlayedParams.id,
    );
    expect(statsService.getRecentlyPlayed).toHaveBeenCalledWith(
      mockAuthLog.accessToken,
      mockRecentlyParamsAfter,
      mockRecentlyPlayedParams.id,
    );

    expect(result).toEqual(mockTopTrackFormatted);
  });

  it('[getRecentlyPlayed] should throw and error', async () => {
    mockAuthService.getAuthLog.mockRejectedValue(mockAxiosError);
    await controller.getRecentlyPlayed(mockRecentlyPlayedParams);

    expect(mockHandleService.handleError).toHaveBeenCalledWith(mockAxiosError);
  });

  it('[currently-playing] should return track playing', async () => {
    const mockResponse = createMockResponse();

    mockAuthService.getAuthLog.mockResolvedValue(mockAuthLog);
    mockStatsService.getCurrentlyPlaying.mockResolvedValue(
      mockResCurrentlyPlaying,
    );

    const result = await controller.getCurrentlyPlaying(
      mockAuthLogDto,
      mockResponse,
    );

    expect(result).toEqual(mockResGetCurrentlyPlaying);
  });

  it('[currently-playing] should throw an error', async () => {
    const mockResponse = createMockResponse();
    mockAuthService.getAuthLog.mockRejectedValue(mockAxiosError);

    await controller.getCurrentlyPlaying(mockAuthLogDto, mockResponse);

    expect(mockHandleService.handleError).toHaveBeenCalledWith(mockAxiosError);
  });
});
