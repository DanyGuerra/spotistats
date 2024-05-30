import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';
import { IErrorResponse } from 'src/common/interfaces/IErrorResponse';

@Injectable()
export class StatsService {
  private hostApiSpotify: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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
          catchError((error) => {
            const {
              response: { data },
            }: { response: { data: IErrorResponse } } = error;

            this.logger.error(error);

            throw new InternalServerErrorException(data.error_description);
          }),
        ),
    );

    this.logger.info('End Starting getUserProfile');

    return data;
  }
}
