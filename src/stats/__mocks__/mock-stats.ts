import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';

export const mockAccessToken = 'access-token';

export const mockHeaders = {
  headers: {
    Authorization: `Bearer ${mockAccessToken}`,
  },
};

export const mockUserProfile: ISpotifyProfile = {
  country: 'MX',
  display_name: 'display_name',
  email: 'mail@mail.com',
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  external_urls: {
    spotify: 'https://spotify/user/display_name',
  },
  followers: {
    href: null,
    total: 2,
  },
  href: 'https://api.spotify/v1/users/display_name',
  id: 'display_name',
  images: [
    {
      height: 300,
      url: 'https://platform.com/platform/profilepic/',
      width: 300,
    },
    {
      height: 64,
      url: 'https://platform.com/platform/profilepic/',
      width: 64,
    },
  ],
  product: 'premium',
  type: 'user',
  uri: 'spotify:user:display_name',
};
