import { Controller, Get, Query, Res } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthService } from 'src/auth/auth.service';
import { GetByIdDto } from 'src/common/dto/get-by-id.dto';
import { StatsService } from './stats.service';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';
import { GetTopArtistDto } from 'src/common/dto/get-top-artists.dto';
import { Response } from 'express';
import { GetRecentlyPlayedDto } from 'src/common/dto/get-recently-played.dto';
import { IRecentlyPlayedParams } from 'src/common/interfaces/IRecentlyPlayedParams';
import { ITopParams, TopTimeRange } from 'src/common/interfaces/IParamsTop';
import { GetTopTracksDto } from 'src/common/dto/get-top-tracks.dto';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';

@Controller('stats')
export class StatsController {
  constructor(
    @InjectPinoLogger(StatsController.name) private readonly logger: PinoLogger,
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  @Get('me')
  async getUserInfo(@Query() querys: GetByIdDto): Promise<ISpotifyProfile> {
    this.logger.info('Starting stats/me route...');

    try {
      const { id } = querys;
      const authLog = await this.authService.getAuthLog(id);
      const userData = await this.statsService.getUserProfile(
        authLog.accessToken,
      );

      return userData;
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End stats/me route');
    }
  }

  @Get('top-artists')
  async myTopArtist(
    @Query()
    {
      id,
      limit = 50,
      time_range = TopTimeRange.LongTerm,
      offset = 0,
    }: GetTopArtistDto,
  ) {
    this.logger.info('Starting stats/top-artists route...');

    try {
      const params: ITopParams = { limit, time_range, offset };

      const authLog = await this.authService.getAuthLog(id);
      const topArtists = await this.statsService.getTopArtists(
        authLog.accessToken,
        params,
        id,
      );

      return topArtists;
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End stats/top-artists route');
    }
  }

  @Get('top-tracks')
  async myTopTracks(
    @Query()
    {
      id,
      limit = 50,
      time_range = TopTimeRange.LongTerm,
      offset = 0,
    }: GetTopTracksDto,
  ) {
    this.logger.info('Starting stats/top-artists route...');

    try {
      const params: ITopParams = { limit, time_range, offset };

      const authLog = await this.authService.getAuthLog(id);
      const topArtists = await this.statsService.getTopTracks(
        authLog.accessToken,
        params,
        id,
      );

      return topArtists;
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End stats/top-artists route');
    }
  }

  @Get('recently-played')
  async getRecentlyPlayed(
    @Query()
    { id, limit = 50, before, after }: GetRecentlyPlayedDto,
  ) {
    this.logger.info('Starting stats/recently-played route...');

    try {
      const params: IRecentlyPlayedParams = { limit };

      if (before) params.before = before;
      else if (after) params.after = after;

      const authLog = await this.authService.getAuthLog(id);
      const recentlyPlayed = await this.statsService.getRecentlyPlayed(
        authLog.accessToken,
        params,
        id,
      );

      return recentlyPlayed;
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End stats/recently-played route');
    }
  }

  @Get('currently-playing')
  async getCurrentlyPlaying(
    @Query()
    { id }: GetByIdDto,
    @Res() res: Response,
  ) {
    this.logger.info('Starting stats/currently-playing route...');

    try {
      const authLog = await this.authService.getAuthLog(id);
      const { data, status, statusText } =
        await this.statsService.getCurrentlyPlaying(authLog.accessToken);

      return res.status(status).json({
        statusCode: status,
        message: statusText,
        data,
      });
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End stats/currently-playing route');
    }
  }
}
