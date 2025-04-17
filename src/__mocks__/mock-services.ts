export const mockHttpCustomService = {
  post: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'spotifyApi') {
      return {
        hostAccountsApiSpotify: 'https://mock-api.spotify.com',
        redirectUriCallback: 'https://mock-callback.com',
        apiSptifyClientId: '123abc',
      };
    }
    return null;
  }),
};
