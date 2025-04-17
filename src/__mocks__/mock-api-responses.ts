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
