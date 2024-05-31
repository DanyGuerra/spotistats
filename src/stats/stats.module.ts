import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthLogSchema } from 'src/auth/auth-logs.schema';
import { StatsController } from './stats.controller';
import { AuthService } from 'src/auth/auth.service';
import { StatsService } from './stats.service';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AuthLog', schema: AuthLogSchema }]),
  ],
  controllers: [StatsController],
  providers: [AuthService, StatsService, ErrorHandlerService],
})
export class StatsModule {}
