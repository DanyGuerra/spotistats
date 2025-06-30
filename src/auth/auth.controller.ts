import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  HttpCode,
  Delete,
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
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
    private readonly configService: ConfigService,
    private readonly errorHandlerService: ErrorHandlerService,
    @InjectPinoLogger(AuthController.name) private readonly logger: PinoLogger,
  ) {}

  @Get('login')
  login(): { url: string } {
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

    try {
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

      const oldLog = await this.authService.findExistingLog(usernameId.id);

      if (oldLog) {
        await this.authService.deleteAuthLog(oldLog.id);
      }

      const dataUpdate: CreateAuthLogDto = {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        usernameId: usernameId.id,
        displayName: usernameId.display_name,
      };

      const updateLog = await this.authService.updateLog(newLog.id, dataUpdate);

      res.redirect(
        HttpStatus.MOVED_PERMANENTLY,
        `${hostFrontEnd}/${updateLog.usernameId}`,
      );
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End auth/callback route');
    }
  }

  @Post('token/refresh')
  @HttpCode(200)
  async refreshTokenById(@Query() querys: GetByIdDto): Promise<AuthLog> {
    this.logger.info('Starting auth/token/refresh route...');

    try {
      const { id } = querys;
      return await this.authService.updateAuthToken(id);
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End auth/token/refresh route');
    }
  }

  @Get('get-log')
  async getAuthLog(@Query() querys: GetByIdDto): Promise<AuthLog> {
    this.logger.info('Starting auth/get-log route...');

    try {
      const { id } = querys;
      return await this.authService.getAuthLog(id);
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End auth/get-log route');
    }
  }

  @Get('get-log-userid')
  async getAuthLogByUserId(@Query('userid') userId: string): Promise<AuthLog> {
    this.logger.info('Starting auth/get-log-userid route...');

    try {
      return await this.authService.getAuthLogByUserId(userId);
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End auth/get-log-userId route');
    }
  }

  @Delete('logout')
  async logout(@Query() querys: GetByIdDto): Promise<AuthLog> {
    this.logger.info('Starting auth/logout route...');

    try {
      const { id } = querys;
      return await this.authService.deleteAuthLog(id);
    } catch (error) {
      this.errorHandlerService.handleError(error);
    } finally {
      this.logger.info('End auth/logout route');
    }
  }
}
