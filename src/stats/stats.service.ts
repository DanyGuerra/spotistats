import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';
import { AxiosError } from 'axios';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';

@Injectable()
export class StatsService {
  private hostApiSpotify: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly errorhandlerService: ErrorHandlerService,
    @InjectPinoLogger(StatsService.name) private readonly logger: PinoLogger,
  ) {
    this.hostApiSpotify = this.configService.get<string>(
      'spotifyApi.hostApiSpotify',
    );
  }

  async getUserProfile(accessToken: string) {
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

    this.logger.info('End Starting getUserProfile');

    return data;
  }
}
