import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuthLog extends Document {
  @Prop()
  code?: string;

  @Prop()
  displayName?: string;

  @Prop()
  accessToken?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  usernameId?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AuthLogSchema = SchemaFactory.createForClass(AuthLog);
