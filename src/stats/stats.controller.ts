import { Controller, Get, Query } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthService } from 'src/auth/auth.service';
import { GetByIdDto } from 'src/common/dto/get-by-id.dto';
import { StatsService } from './stats.service';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';

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

    this.logger.info('End get user info...');

    return userData;
  }
}
