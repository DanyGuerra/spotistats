import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthLogSchema } from 'src/auth/auth-logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AuthLog', schema: AuthLogSchema }]),
  ],
})
export class StatsModule {}
