import { Document } from 'mongoose';

export interface AuthLog extends Document {
  readonly code?: string;
  readonly usernameId?: string;
  readonly state?: string;
  readonly access_token?: string;
  readonly refresh_token?: string;
}
