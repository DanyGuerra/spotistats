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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('login')
  login(@Res() res: Response) {
    const hostApiSpotify = this.configService.get<string>(
      'hostAccountsApiSpotify',
    );

    const redirectUri = this.configService.get<string>('redirectUriCallback');
    const clientId = this.configService.get<string>('apiSptifyClientId');
    const apiUserScope = this.configService.get<string>('apiUserScope');

    const queryParams = {
      response_type: 'code',
      client_id: clientId,
      scope: apiUserScope,
      redirect_uri: redirectUri,
      state: generateShortUUID(16),
      show_dialog: true,
    };

    res.redirect(
      `${hostApiSpotify}/authorize?${queryString.stringify(queryParams)}`,
    );
  }

  @Get('callback')
  async authCallBack(@Query() authLogs: CreateAuthLogDto) {
    if (!authLogs.state) {
      throw new BadRequestException('state_mismatch');
    }

    const newLog = await this.authService.createNewLog(authLogs);
    const token = await this.authService.createUserToken(newLog);

    const dataUpdate: CreateAuthLogDto = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };

    const updateLog = await this.authService.updateLog(newLog.id, dataUpdate);

    return updateLog;
  }
}
