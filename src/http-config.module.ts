import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const clientId = configService.get<string>('apiSptifyClientId');
        const clientSecret = configService.get<string>('apiSptifySecret');
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString(
          'base64',
        );

        return {
          timeout: 5000,
          maxRedirects: 5,
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [HttpModule],
})
export class HttpConfigModule {}
