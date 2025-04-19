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

export const mockAuthLog: AuthLog = {
  code: '123abc',
  refreshToken: 'mock-refresh-token',
} as any;

export const mockAccessToken = 'new-access-token';
export const mockNewAccessToken = 'new-access-token';

export const mockUpdatedAuthLog = {
  _id: 'mock-id',
  accessToken: mockNewAccessToken,
};

export const mockAuthLogResponse = {
  data: {
    access_token: mockAccessToken,
    token_type: 'Bearer',
    expires_in: 3600,
  },
} as any;

export const mockUserId = 'userId';

export const mockRequestToken = {
  grant_type: 'authorization_code',
  code: '123abc',
  redirect_uri: 'http://localhost/callback',
};

export const mockResponseData = { access_token: 'token123', expires_in: 3600 };
export const mockUriCallback = 'http://localhost/callback';
