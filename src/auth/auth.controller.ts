import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthLogDto } from 'src/auth/create-auth-log.dto';
import { Response } from 'express';
import * as queryString from 'querystring';
import { ConfigService } from '@nestjs/config';
import { generateShortUUID } from 'src/utils/uuid-utils';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { StatsService } from 'src/stats/stats.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(AuthController.name) private readonly logger: PinoLogger,
  ) {}

  @Get('login')
  login(@Res() res: Response) {
    this.logger.info('Starting auth/login route...');
    const hostApiSpotify = this.configService.get<string>(
      'spotifyApi.hostAccountsApiSpotify',
    );

    const redirectUri = this.configService.get<string>(
      'spotifyApi.redirectUriCallback',
    );
    const clientId = this.configService.get<string>(
      'spotifyApi.apiSptifyClientId',
    );
    const apiUserScope = this.configService.get<string>(
      'spotifyApi.apiUserScope',
    );

    const queryParams = {
      response_type: 'code',
      client_id: clientId,
      scope: apiUserScope,
      redirect_uri: redirectUri,
      state: generateShortUUID(16),
      show_dialog: true,
    };

    this.logger.info('Ending auth/login route...');

    res.redirect(
      `${hostApiSpotify}/authorize?${queryString.stringify(queryParams)}`,
    );
  }

  @Get('callback')
  async authCallBack(@Query() authLogs: CreateAuthLogDto) {
    this.logger.info('Starting auth/callback route...');

    if (!authLogs.state) {
      throw new BadRequestException('state_mismatch');
    }

    const newLog = await this.authService.createNewLog(authLogs);
    const token = await this.authService.createUserToken(newLog);
    const usernameId = await this.statsService.getUserProfile(
      token.access_token,
    );

    const dataUpdate: CreateAuthLogDto = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      usernameId: usernameId.id,
      displayName: usernameId.display_name,
    };

    const updateLog = await this.authService.updateLog(newLog.id, dataUpdate);

    this.logger.info('Ending auth/callback route');

    return updateLog;
  }
}
