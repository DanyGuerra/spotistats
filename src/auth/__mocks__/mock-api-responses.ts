import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { IResponseAccessToken } from 'src/common/interfaces/IResponseAccessToken';
import { IResponseError } from 'src/common/interfaces/IResponseError';

export const mockAccessTokenResponse: AxiosResponse<IResponseAccessToken> = {
  data: {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'scope-test',
  },
  status: 200,
  statusText: 'OK',
  headers: new AxiosHeaders(),
  config: {
    headers: new AxiosHeaders(),
  },
};

export const mockAutLogResponse: AxiosResponse<IResponseAccessToken> = {
  data: {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'scope-test',
  },
  status: 200,
  statusText: 'OK',
  headers: new AxiosHeaders(),
  config: {
    headers: new AxiosHeaders(),
  },
};

export const mockNewAccessTokenResponse: { data: IResponseAccessToken } = {
  data: {
    access_token: 'new_access_token',
    refresh_token: 'refresh_token',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'scope-test',
  },
};

export const mockAccessTokenError: IResponseError = {
  error: { status: 401, message: 'Unauthorized' },
};

export const mockAxiosError: AxiosError = {
  isAxiosError: true,
  toJSON: () => ({}),
  name: 'AxiosError',
  message: 'Request failed with status code 401',
  response: {
    data: mockAccessTokenError,
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config: {},
  } as AxiosResponse,
};

export const mockUrlEncodedData: string =
  'grant_type=authorization_code&code=123';
export const mockHostApiSpotify: string =
  'https://mock-api.spotify.com/api/token';

export const mockAuthLog: AuthLog = {
  code: '123abc',
  refreshToken: 'mock-refresh-token',
} as any;

export const mockUpdatedAuthLog: AuthLog = {
  _id: 'mock-id',
  accessToken: mockNewAccessTokenResponse.data.access_token,
} as any;

export const mockUserId: string = 'userId';

export const mockRequestToken = {
  grant_type: 'authorization_code',
  code: '123abc',
  redirect_uri: 'http://localhost/callback',
};

export const mockResponseData = { access_token: 'token123', expires_in: 3600 };
export const mockUriCallback = 'http://localhost/callback';

export const mockState = 'uid_16_long';

export const mockQueryParamsLogin = {
  response_type: 'code',
  client_id: 'apiSptifyClientId',
  scope: 'apiUserScope',
  redirect_uri: 'https://mock-callback.com',
  state: mockState,
  show_dialog: true,
};
