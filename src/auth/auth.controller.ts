import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthLogDto } from 'src/common/dto/create-auth-log.dto';
import * as queryString from 'querystring';
import { ConfigService } from '@nestjs/config';
import { generateShortUUID } from 'src/utils/uuid-utils';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { StatsService } from 'src/stats/stats.service';
import { GetByIdDto } from '../common/dto/get-by-id.dto';
import { AuthLog } from './auth-logs.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(AuthController.name) private readonly logger: PinoLogger,
  ) {}

  @Get('login')
  login() {
    this.logger.info('Starting auth/login route...');

    const {
      hostAccountsApiSpotify,
      redirectUriCallback,
      apiSptifyClientId,
      apiUserScope,
    } = this.configService.get<{
      hostAccountsApiSpotify: string;
      redirectUriCallback: string;
      apiSptifyClientId: string;
      apiUserScope: string;
    }>('spotifyApi');

    const queryParams = {
      response_type: 'code',
      client_id: apiSptifyClientId,
      scope: apiUserScope,
      redirect_uri: redirectUriCallback,
      state: generateShortUUID(16),
      show_dialog: true,
    };

    this.logger.info('End auth/login route...');

    return {
      url: `${hostAccountsApiSpotify}/authorize?${queryString.stringify(queryParams)}`,
    };
  }

  @Get('callback')
  async authCallBack(@Query() querys: CreateAuthLogDto, @Res() res: Response) {
    this.logger.info('Starting auth/callback route...');

    const hostFrontEnd = this.configService.get<string>('hostFrontEnd');

    if (querys.error) {
      res.redirect(
        HttpStatus.MOVED_PERMANENTLY,
        `${hostFrontEnd}/login-error?info=${querys.error}`,
      );
    }

    if (!querys.state) {
      res.redirect(
        HttpStatus.MOVED_PERMANENTLY,
        `${hostFrontEnd}/login-error?info=state_mismatch`,
      );
    }

    const newLog = await this.authService.createNewLog(querys);
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

    this.logger.info('End auth/callback route');

    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      `${hostFrontEnd}/${updateLog.usernameId}`,
    );
  }

  @Post('token/refresh')
  @HttpCode(200)
  async refreshTokenById(@Query() querys: GetByIdDto): Promise<AuthLog> {
    this.logger.info('Starting auth/token/refresh route...');

    const { id } = querys;

    const updateAuthLog = await this.authService.updateAuthToken(id);

    this.logger.info('End auth/token/refresh route');

    return updateAuthLog;
  }

  @Get('get-log')
  getAuthLog(@Query() querys: GetByIdDto): Promise<AuthLog> {
    this.logger.info('Starting auth/get-log route...');

    const { id } = querys;

    const authLog = this.authService.getAuthLog(id);

    this.logger.info('End auth/get-log route');

    return authLog;
  }

  @Get('get-log-userid')
  getAuthLogByUserId(@Query('userid') userId: string): Promise<AuthLog> {
    this.logger.info('Starting auth/get-log-userid route...');

    const authLog = this.authService.getAuthLogByUserId(userId);

    this.logger.info('End auth/get-log-userId route');

    return authLog;
  }
}
