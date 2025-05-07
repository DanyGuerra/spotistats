import { IResponseAccessToken } from '../common/interfaces/IResponseAccessToken';
import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { CreateAuthLogDto } from 'src/common/dto/create-auth-log.dto';
import { GetByIdDto } from 'src/common/dto/get-by-id.dto';
import { IResponseError } from 'src/common/interfaces/IResponseError';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';

export const mockUrl: string = 'http://mock-url.com/';

export const mockConfig: AxiosRequestConfig = {
  headers: { Authorization: 'Bearer token' },
};

export const mockGenericData: any = {
  data: [
    { id: 1, trackName: 'TrackName1' },
    { id: 2, trackName: 'TrackName2' },
  ],
};

export const mockSuccessResponse: AxiosResponse = {
  data: { success: true },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
  },
};

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
export const mocAccountApiSpotify: string =
  'https://mock-accounts-api.spotify.com/api/token';

export const mockAuthLog: AuthLog = {
  id: 'mock-id',
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

export const mockQueryCreateAuth: CreateAuthLogDto = {
  state: 'mock-state',
  code: 'auth-code',
};

export const mockQueryGetId: GetByIdDto = {
  id: 'id',
};

export const mockQueryError: CreateAuthLogDto = {
  state: '',
  code: 'auth-code',
  error: 'error',
};

export const mockRes = {
  redirect: jest.fn(),
  status: jest.fn(() => ({ json: jest.fn() })),
};

export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockImplementation((body) => body);
  res.redirect = jest.fn();
  return res;
};

export const mockUserProfile: ISpotifyProfile = {
  display_name: 'display_name',
  external_urls: { spotify: 'url' },
  href: 'href',
  id: 'user_id',
  images: [{ url: 'url', height: 10, width: 10 }],
  type: 'type',
  uri: 'uri',
  followers: { href: 'href', total: 10 },
  country: 'country',
  product: 'product',
  explicit_content: { filter_enabled: true, filter_locked: true },
  email: 'user_email',
};

export const mockDataUpdate: CreateAuthLogDto = {
  accessToken: mockAccessTokenResponse.data.access_token,
  refreshToken: mockAccessTokenResponse.data.refresh_token,
  usernameId: mockUserProfile.id,
  displayName: mockUserProfile.display_name,
};
