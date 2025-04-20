export const mockHttpCustomService = {
  post: jest.fn(),
};

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
    return null;
  }),
};
