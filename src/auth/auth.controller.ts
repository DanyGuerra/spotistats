import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthLogDto } from 'src/auth/create-auth-log.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('callback')
  async authCallBack(@Query() authLogs: CreateAuthLogDto) {
    const newLog = await this.authService.createNewLog(authLogs);
    const token = await this.authService.createUserToken(newLog);

    const dataUpdate: CreateAuthLogDto = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
    };

    const updateLog = await this.authService.updateLog(newLog.id, dataUpdate);

    return updateLog;
  }
}
