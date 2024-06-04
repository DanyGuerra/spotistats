import { Controller, Get, Query } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthService } from 'src/auth/auth.service';
import { GetByIdDto } from 'src/common/dto/get-by-id.dto';
import { StatsService } from './stats.service';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';
import { GetTopArtistDto } from 'src/common/dto/get-top-artists.dto';

@Controller('stats')
export class StatsController {
  constructor(
    @InjectPinoLogger(StatsController.name) private readonly logger: PinoLogger,
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
  ) {}

  @Get('me')
  async getUserInfo(@Query() querys: GetByIdDto): Promise<ISpotifyProfile> {
    this.logger.info('Starting get user info...');

    const { id } = querys;
    const authLog = await this.authService.getAuthLog(id);
    const userData = await this.statsService.getUserProfile(
      authLog.accessToken,
    );

    this.logger.info('End get user info');

    return userData;
  }

  @Get('top-artists')
  async myTopArtist(
    @Query()
    { id, limit = 50, time_range = 'long_term', offset }: GetTopArtistDto,
  ) {
    this.logger.info('Starting my top artists...');

    const params = { limit, time_range, offset };

    const authLog = await this.authService.getAuthLog(id);
    const topArtists = await this.statsService.getTopArtists(
      authLog.accessToken,
      params,
      id,
    );

    this.logger.info('End my top artists');

    return topArtists;
  }
}
