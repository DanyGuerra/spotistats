import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';
import * as qs from 'querystring';
import { AxiosError } from 'axios';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import { IResponseTopArtists } from 'src/common/interfaces/IResponseTopArtists';
import { urlReplace } from 'src/utils/utils';
import { IResponseTopTracks } from 'src/common/interfaces/IResponseTopTracks';
import { IResponseCurrentlyPlaying } from 'src/common/interfaces/IResponseCurrentlyPlaying';

@Injectable()
export class StatsService {
  private hostApiSpotify: string;
  private host: string;
  private apiContext: string;

  constructor(
    private readonly httpService: HttpCustomService,
    private readonly configService: ConfigService,
    private readonly errorhandlerService: ErrorHandlerService,
    @InjectPinoLogger(StatsService.name) private readonly logger: PinoLogger,
  ) {
    this.hostApiSpotify = this.configService.get<string>(
      'spotifyApi.hostApiSpotify',
    );
    this.host = this.configService.get<string>('host');
    this.apiContext = this.configService.get<string>('apiContext');
  }

  async getUserProfile(accessToken: string): Promise<ISpotifyProfile> {
    this.logger.info('Starting getUserProfile...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .get<ISpotifyProfile>(`${this.hostApiSpotify}/v1/me`, { headers })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            this.errorhandlerService.handleError(error);

            return throwError(() => error);
          }),
        ),
    );

    this.logger.info('End getUserProfile');

    return data;
  }

  async getTopArtists(
    accessToken: string,
    params,
    id,
  ): Promise<IResponseTopArtists> {
    this.logger.info('Starting getTopArtists...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const querys = qs.stringify(params);

    const { data } = await firstValueFrom(
      this.httpService
        .get<IResponseTopArtists>(
          `${this.hostApiSpotify}/v1/me/top/artists?${querys}`,
          {
            headers,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            this.errorhandlerService.handleError(error);

            return throwError(() => error);
          }),
        ),
    );

    data.href = urlReplace(
      id,
      data.href,
      `${this.hostApiSpotify}/v1/me/top/artists`,
      `${this.host}${this.apiContext}/stats/top-artists`,
    );
    data.previous = urlReplace(
      id,
      data.previous,
      `${this.hostApiSpotify}/v1/me/top/artists`,
      `${this.host}${this.apiContext}/stats/top-artists`,
    );
    data.next = urlReplace(
      id,
      data.next,
      `${this.hostApiSpotify}/v1/me/top/artists`,
      `${this.host}${this.apiContext}/stats/top-artists`,
    );

    this.logger.info('End getTopArtists');

    return data;
  }

  async getTopTracks(
    accessToken: string,
    params,
    id,
  ): Promise<IResponseTopTracks> {
    this.logger.info('Starting getTopTracks...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const querys = qs.stringify(params);

    const { data } = await firstValueFrom(
      this.httpService
        .get<IResponseTopTracks>(
          `${this.hostApiSpotify}/v1/me/top/tracks?${querys}`,
          {
            headers,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            this.errorhandlerService.handleError(error);

            return throwError(() => error);
          }),
        ),
    );

    data.href = urlReplace(
      id,
      data.href,
      `${this.hostApiSpotify}/v1/me/top/tracks`,
      `${this.host}${this.apiContext}/stats/top-tracks`,
    );
    data.previous = urlReplace(
      id,
      data.previous,
      `${this.hostApiSpotify}/v1/me/top/tracks`,
      `${this.host}${this.apiContext}/stats/top-tracks`,
    );
    data.next = urlReplace(
      id,
      data.next,
      `${this.hostApiSpotify}/v1/me/top/tracks`,
      `${this.host}${this.apiContext}/stats/top-tracks`,
    );

    this.logger.info('End getTopTracks');

    return data;
  }

  async getCurrentlyPlaying(accessToken: string) {
    this.logger.info('Starting getCurrentlyPlaying...');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get<IResponseCurrentlyPlaying>(
          `${this.hostApiSpotify}/v1/me/player/currently-playing`,
          {
            headers,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            this.errorhandlerService.handleError(error);

            return throwError(() => error);
          }),
        ),
    );

    this.logger.info('End getCurrentlyPlaying');

    return { data, status, statusText };
  }
}
