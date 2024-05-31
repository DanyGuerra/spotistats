export interface IRequestRefreshToken {
  [key: string]: string;
  grant_type: string;
  refresh_token: string;
  client_id: string;
}
