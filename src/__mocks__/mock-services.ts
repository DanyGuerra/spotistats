export const mockHttpCustomService = {
  post: jest.fn(),
  get: jest.fn(),
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

export const mockEnvVariables = {
  host: 'http://localhost:3001',
  port: 3000,
  apiContext: 'api/v',
  hostFrontEnd: 'http://localhost:4200',
  database: { uri: 'mongo//uri' },
  spotifyApi: {
    hostAccountsApiSpotify: 'https://mock-accounts-api.spotify.com',
    redirectUriCallback: 'https://mock-callback.com',
    apiSptifyClientId: 'apiSptifyClientId',
    apiUserScope: 'apiUserScope',
    hostApiSpotify: 'https://mock-api-spotify.com',
    apiSptifySecret: 'spotify-secret',
  },
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    return mockEnvVariables[key];
  }),
};

export const mockHandleService = {
  handleError: jest.fn(),
};
