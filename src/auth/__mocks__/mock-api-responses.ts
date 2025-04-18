import { AuthLog } from 'src/auth/auth-logs.schema';

export const mockAccessTokenResponse = {
  data: {
    access_token: 'access_token_value',
    refresh_token: 'refresh_token_value',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'user-read-private user-read-email',
  },
};

export const mockAccessTokenError = {
  data: { message: 'Unauthorized' },
  status: 401,
  statusText: 'Unauthorized',
  headers: {},
  config: {},
};

export const mockUrlEncodedData = 'grant_type=authorization_code&code=123';
export const mockHostApiSpotify = 'https://mock-api.spotify.com/api/token';

export const mockAuthLog: AuthLog = { code: '123abc' } as any;

export const mockRequestToken = {
  grant_type: 'authorization_code',
  code: '123abc',
  redirect_uri: 'http://localhost/callback',
};

export const mockResponseData = { access_token: 'token123', expires_in: 3600 };
export const mockUriCallback = 'http://localhost/callback';
