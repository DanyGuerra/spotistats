import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthLogSchema } from 'src/auth/auth-logs.schema';
import { StatsService } from 'src/stats/stats.service';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AuthLog', schema: AuthLogSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    StatsService,
    ErrorHandlerService,
    HttpCustomService,
  ],
})
export class AuthModule {}
