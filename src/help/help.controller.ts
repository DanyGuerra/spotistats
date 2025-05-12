import { Controller, Get, HttpCode } from '@nestjs/common';
import { IncludeData } from 'src/decorators/include-data.decorator';
import { MessageResponse } from 'src/decorators/message-response-decorator';

@Controller('help')
export class HelpController {
  @Get()
  @MessageResponse('success')
  @IncludeData(false)
  @HttpCode(200)
  getApiHelp() {}
}
