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
  mockAuthLogId,
  mockHeaders,
  mockParamsRecently,
  mockParamsTop,
  mockQuerys,
  mockQuerysRecently,
  mockRecentlyPlayed,
  mockRecentlyPlayedFormatted,
  mockResponseCurrentlyPlaying,
  mockTopArtists,
  mockTopArtistsFormatted,
  mockTopArtistsRank,
  mockTopTrack,
  mockTopTrackFormatted,
  mockTopTrackRank,
  mockUserProfile,
} from './__mocks__/mock-stats';
import * as utils from 'src/utils/utils';

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
    mockHttpCustomService.get.mockReturnValue(of({ data: mockTopArtists }));

    jest.spyOn(utils, 'addRankingNumbers').mockReturnValue(mockTopArtistsRank);
    jest
      .spyOn(utils, 'formatPaginationUrls')
      .mockReturnValue(mockTopArtistsFormatted);

    const result = await service.getTopArtists(
      mockAccessToken,
      mockParamsTop,
      mockAuthLogId,
    );

    expect(mockHttpCustomService.get).toHaveBeenCalledWith(
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/top/artists?${mockQuerys}`,
      mockHeaders,
    );

    expect(utils.addRankingNumbers).toHaveBeenCalledWith(mockTopArtists);
    expect(utils.formatPaginationUrls).toHaveBeenCalledWith(
      mockTopArtistsRank,
      mockAuthLogId,
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/top/artists`,
      `${mockEnvVariables.host}${mockEnvVariables.apiContext}/stats/top-artists`,
    );

    expect(result).toEqual(mockTopArtistsFormatted);
  });

  it('[getTopTracks] success', async () => {
    mockHttpCustomService.get.mockReturnValue(of({ data: mockTopTrack }));

    jest.spyOn(utils, 'addRankingNumbers').mockReturnValue(mockTopTrackRank);
    jest
      .spyOn(utils, 'formatPaginationUrls')
      .mockReturnValue(mockTopTrackFormatted);

    const result = await service.getTopTracks(
      mockAccessToken,
      mockParamsTop,
      mockAuthLogId,
    );

    expect(mockHttpCustomService.get).toHaveBeenCalledWith(
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/top/tracks?${mockQuerys}`,
      mockHeaders,
    );

    expect(utils.addRankingNumbers).toHaveBeenCalledWith(mockTopTrack);
    expect(utils.formatPaginationUrls).toHaveBeenCalledWith(
      mockTopTrackRank,
      mockAuthLogId,
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/top/tracks`,
      `${mockEnvVariables.host}${mockEnvVariables.apiContext}/stats/top-tracks`,
    );

    expect(result).toEqual(mockTopTrackFormatted);
  });

  it('[getRecentlyPlayed] success', async () => {
    mockHttpCustomService.get.mockReturnValue(of({ data: mockRecentlyPlayed }));

    jest
      .spyOn(utils, 'formatPaginationUrls')
      .mockReturnValue(mockRecentlyPlayedFormatted);

    const result = await service.getRecentlyPlayed(
      mockAccessToken,
      mockParamsRecently,
      mockAuthLogId,
    );

    expect(mockHttpCustomService.get).toHaveBeenCalledWith(
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/player/recently-played?${mockQuerysRecently}`,
      mockHeaders,
    );

    expect(utils.formatPaginationUrls).toHaveBeenCalledWith(
      mockRecentlyPlayed,
      mockAuthLogId,
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/player/recently-played`,
      `${mockEnvVariables.host}${mockEnvVariables.apiContext}/stats/recently-played`,
    );

    expect(result).toEqual(mockRecentlyPlayedFormatted);
  });

  it('[getCurrentlyPlaying] success', async () => {
    mockHttpCustomService.get.mockReturnValue(of(mockResponseCurrentlyPlaying));

    const result = await service.getCurrentlyPlaying(mockAccessToken);

    expect(mockHttpCustomService.get).toHaveBeenCalledWith(
      `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/me/player/currently-playing`,
      mockHeaders,
    );

    expect(result).toEqual(mockResponseCurrentlyPlaying);
  });
});
