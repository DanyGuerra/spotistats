import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';
import * as qs from 'querystring';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import { ITopArtistData } from 'src/common/interfaces/IResponseTopArtists';
import { addRankingNumbers, formatPaginationUrls } from 'src/utils/utils';
import { ITopTrackData } from 'src/common/interfaces/IResponseTopTracks';
import { ICurrentlyPlaying } from 'src/common/interfaces/IResponseCurrentlyPlaying';
import { IRecentlyPlayedData } from 'src/common/interfaces/IResponseRecentlyPlayed';
import { ITopParams } from 'src/common/interfaces/IParamsTop';
import { IRecentlyPlayedParams } from 'src/common/interfaces/IRecentlyPlayedParams';

@Injectable()
export class StatsService {
  private hostApiSpotify: string;
  private host: string;
  private apiContext: string;

  constructor(
    private readonly httpService: HttpCustomService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(StatsService.name) private readonly logger: PinoLogger,
  ) {
    const { hostApiSpotify } = this.configService.get<{
      hostApiSpotify: string;
    }>('spotifyApi');
    this.hostApiSpotify = hostApiSpotify;
    this.host = this.configService.get<string>('host');
    this.apiContext = this.configService.get<string>('apiContext');
  }

  async getUserProfile(accessToken: string): Promise<ISpotifyProfile> {
    this.logger.info('Starting getUserProfile...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<ISpotifyProfile>(`${this.hostApiSpotify}/v1/me`, {
        headers,
      }),
    );

    this.logger.info('End getUserProfile');

    return data;
  }

  async getTopArtists(
    accessToken: string,
    params: ITopParams,
    id: string,
  ): Promise<ITopArtistData> {
    this.logger.info('Starting getTopArtists...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const querys = qs.stringify(params as any);

    const { data } = await firstValueFrom(
      this.httpService.get<ITopArtistData>(
        `${this.hostApiSpotify}/v1/me/top/artists?${querys}`,
        {
          headers,
        },
      ),
    );

    const rankData = addRankingNumbers<ITopArtistData>(data);
    const formattedData = formatPaginationUrls<ITopArtistData>(
      rankData,
      id,
      `${this.hostApiSpotify}/v1/me/top/artists`,
      `${this.host}${this.apiContext}/stats/top-artists`,
    );

    this.logger.info('End getTopArtists');

    return formattedData;
  }

  async getTopTracks(
    accessToken: string,
    params: ITopParams,
    id,
  ): Promise<ITopTrackData> {
    this.logger.info('Starting getTopTracks...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const querys = qs.stringify(params as any);

    const { data } = await firstValueFrom(
      this.httpService.get<ITopTrackData>(
        `${this.hostApiSpotify}/v1/me/top/tracks?${querys}`,
        {
          headers,
        },
      ),
    );

    const rankData = addRankingNumbers<ITopTrackData>(data);
    const formattedData = formatPaginationUrls<ITopTrackData>(
      rankData,
      id,
      `${this.hostApiSpotify}/v1/me/top/tracks`,
      `${this.host}${this.apiContext}/stats/top-tracks`,
    );

    this.logger.info('End getTopTracks');

    return formattedData;
  }

  async getRecentlyPlayed(
    accessToken: string,
    params: IRecentlyPlayedParams,
    id: string,
  ): Promise<IRecentlyPlayedData> {
    this.logger.info('Starting getRecentlyPlayed...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const querys = qs.stringify(params as any);

    const { data } = await firstValueFrom(
      this.httpService.get<IRecentlyPlayedData>(
        `${this.hostApiSpotify}/v1/me/player/recently-played?${querys}`,
        {
          headers,
        },
      ),
    );

    const formatedData = formatPaginationUrls<IRecentlyPlayedData>(
      data,
      id,
      `${this.hostApiSpotify}/v1/me/player/recently-played`,
      `${this.host}${this.apiContext}/stats/recently-played`,
    );

    this.logger.info('End getRecentlyPlayed');

    return formatedData;
  }

  async getCurrentlyPlaying(accessToken: string) {
    this.logger.info('Starting getCurrentlyPlaying...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const { data, status, statusText } = await firstValueFrom(
      this.httpService.get<ICurrentlyPlaying>(
        `${this.hostApiSpotify}/v1/me/player/currently-playing`,
        {
          headers,
        },
      ),
    );

    this.logger.info('End getCurrentlyPlaying');

    return { data, status, statusText };
  }
}
