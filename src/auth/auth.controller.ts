import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthLogDto } from 'src/auth/create-auth-log.dto';
import { Response } from 'express';
import * as queryString from 'querystring';
import { ConfigService } from '@nestjs/config';

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

    // TODO: agregar todas las query params
    const queryParams = {
      response_type: 'code',
    };

    res.redirect(
      `${hostApiSpotify}/authorize?${queryString.stringify(queryParams)}`,
    );
  }

  @Get('callback')
  async authCallBack(@Query() authLogs: CreateAuthLogDto) {
    console.log(authLogs);
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
