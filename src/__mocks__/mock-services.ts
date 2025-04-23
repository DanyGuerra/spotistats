export const mockHttpCustomService = {
  post: jest.fn(),
};

export const mockAuthService = {
  apiTokenRequest: jest.fn(),
  createNewLog: jest.fn(),
  createUserToken: jest.fn(),
  updateLog: jest.fn(),
  getAuthLog: jest.fn(),
  getAuthLogByUserId: jest.fn(),
  updateAuthToken: jest.fn(),
  deleteAuthLog: jest.fn(),
};

export const mockStatsService = {
  getUserProfile: jest.fn(),
};

export const mockHostFrontEnd = 'http://localhost:4200';

export const mockSpotifyApiEnv = {
  hostAccountsApiSpotify: 'https://mock-api.spotify.com',
  redirectUriCallback: 'https://mock-callback.com',
  apiSptifyClientId: 'apiSptifyClientId',
  apiUserScope: 'apiUserScope',
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'spotifyApi') {
      return mockSpotifyApiEnv;
    }
    if (key === 'hostFrontEnd') {
      return mockHostFrontEnd;
    }
    return null;
  }),
};

export const mockHandleService = {
  handleError: jest.fn(),
};
