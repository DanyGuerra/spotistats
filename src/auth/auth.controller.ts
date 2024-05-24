import { Controller, Post, Query } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('callback')
  authCallBack(@Query('code') code: string, @Query('state') state: string) {
    // TODO: Implements logic
    return { code, state };
  }
}
