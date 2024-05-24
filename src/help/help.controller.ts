import { Controller, Get } from '@nestjs/common';

@Controller('help')
export class HelpController {
  @Get()
  getApiHelp() {}
}
