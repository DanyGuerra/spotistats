import { Module } from '@nestjs/common';
import { HelpController } from './help/help.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [HelpController],
  providers: [],
  exports: [],
})
export class AppModule {}
