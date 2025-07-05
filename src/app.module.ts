import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HelpModule } from './help/help.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpConfigModule } from './http-config.module';
import { LoggerModule } from 'nestjs-pino';
import { StatsModule } from './stats/stats.module';
import { HttpCustomService } from './common/CustomHttp/custom-http.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,

        autoLogging: false,
      },
    }),
    AuthModule,
    HelpModule,
    HttpConfigModule,
    StatsModule,
  ],
  controllers: [],
  providers: [HttpCustomService],
  exports: [HttpCustomService],
})
export class AppModule {}
