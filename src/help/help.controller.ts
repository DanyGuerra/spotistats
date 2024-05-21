import { Controller, Get } from '@nestjs/common';
import { HelpResponse } from './help.interface';

@Controller('help')
export class HelpController {
  @Get()
  getApiHelp(): HelpResponse {
    return { message: 'success' };
  }
}
