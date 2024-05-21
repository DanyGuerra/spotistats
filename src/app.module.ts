import { Module } from '@nestjs/common';
import { HelpController } from './help/help.controller';

@Module({
  imports: [],
  controllers: [HelpController],
  providers: [],
  exports: [],
})
export class AppModule {}
