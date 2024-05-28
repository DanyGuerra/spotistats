import { Schema } from 'mongoose';

export const AuthLogSchema = new Schema({
  code: String,
  state: String,
  access_token: String,
  refresh_token: String,
  usernameId: String,
});
