import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuthLog extends Document {
  @Prop()
  code?: string;

  @Prop()
  access_token?: string;

  @Prop()
  refresh_token?: string;

  @Prop()
  usernameId?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AuthLogSchema = SchemaFactory.createForClass(AuthLog);
