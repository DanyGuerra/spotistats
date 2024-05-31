export interface IRequestToken {
  [key: string]: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
}
