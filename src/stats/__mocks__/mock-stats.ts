import { mockEnvVariables } from 'src/__mocks__/mock-services';
import { GetByIdDto } from 'src/common/dto/get-by-id.dto';
import { GetRecentlyPlayedDto } from 'src/common/dto/get-recently-played.dto';
import { GetTopArtistDto } from 'src/common/dto/get-top-artists.dto';
import { GetTopTracksDto } from 'src/common/dto/get-top-tracks.dto';
import { ITopParams, TopTimeRange } from 'src/common/interfaces/IParamsTop';
import { IRecentlyPlayedParams } from 'src/common/interfaces/IRecentlyPlayedParams';
import { ICurrentlyPlaying } from 'src/common/interfaces/IResponseCurrentlyPlaying';
import {
  IRecentlyPlayedData,
  TrackPlayed,
} from 'src/common/interfaces/IResponseRecentlyPlayed';
import {
  ITopArtistData,
  TopArtistItem,
} from 'src/common/interfaces/IResponseTopArtists';
import {
  ITopTrackData,
  TopTrackItem,
} from 'src/common/interfaces/IResponseTopTracks';
import { ISpotifyProfile } from 'src/common/interfaces/ISpotifyProfile';

export const mockAccessToken = 'access-token';
export const mockAuthLogId = 'id';

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

export const mockParamsTop: ITopParams = {
  limit: 50,
  time_range: TopTimeRange.LongTerm,
  offset: 0,
};

export const mockParamsRecently: IRecentlyPlayedParams = {
  limit: 50,
};

export const mockTopArtistsParams: GetTopArtistDto = {
  id: 'mock-id',
  ...mockParamsTop,
};

export const mockDefaultTopArtistsParams: GetTopArtistDto = {
  id: 'mock-id',
};

export const mockTopTracksParams: GetTopTracksDto = {
  id: 'mock-id',
  ...mockParamsTop,
};

export const mockDefaultTopTracksParams: GetTopTracksDto = {
  id: 'mock-id',
};

export const mockRecentlyParams: IRecentlyPlayedParams = {
  limit: 50,
  before: 123127,
};

export const mockRecentlyParamsAfter: IRecentlyPlayedParams = {
  limit: 50,
  after: 123127,
};

export const mockRecentlyPlayedParams: GetRecentlyPlayedDto = {
  id: 'mock-id',
  ...mockRecentlyParams,
};

export const mockRecentlyPlayedParamsAfter: GetRecentlyPlayedDto = {
  id: 'mock-id',
  after: 123127,
};

export const mockAuthLogDto: GetByIdDto = { id: 'mock-id' };

export const mockQuerys = `limit=${mockParamsTop.limit}&time_range=${mockParamsTop.time_range}&offset=${mockParamsTop.offset}`;
export const mockQuerysRecently = `limit=${mockParamsRecently.limit}`;

const mockTopArtistItem: TopArtistItem = {
  external_urls: {
    spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/id`,
  },
  followers: {
    href: null,
    total: 29925131,
  },
  genres: ['indie', 'garage rock'],
  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/id`,
  id: 'id',
  images: [
    {
      height: 640,
      url: 'https://i.scdn.co/image/image640',
      width: 640,
    },
    {
      height: 320,
      url: 'https://i.scdn.co/image/image320',
      width: 320,
    },
    {
      height: 160,
      url: 'https://i.scdn.co/image/image160',
      width: 160,
    },
  ],
  name: 'Artist Name',
  popularity: 88,
  type: 'artist',
  uri: 'spotify:artist:artistid',
};

export const mockTopArtistItemWithRank: TopArtistItem = {
  ...mockTopArtistItem,
  rank_number: 1,
};

export const mockTopArtists: ITopArtistData = {
  items: [mockTopArtistItem],
  total: 522,
  limit: 1,
  offset: 0,

  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-artists?limit=1&time_range=long_term`,
  next: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-artists?offset=1&limit=1&time_range=long_term`,
  previous: null,
};

export const mockTopArtistsRank: ITopArtistData = {
  items: [mockTopArtistItemWithRank],
  total: 522,
  limit: 1,
  offset: 0,
  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-artists?limit=1&time_range=long_term`,
  next: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-artists?offset=1&limit=1&time_range=long_term`,
  previous: null,
};

export const mockTopArtistsFormatted: ITopArtistData = {
  items: [mockTopArtistItemWithRank],
  total: 522,
  limit: 1,
  offset: 0,
  href: `${mockEnvVariables.host}/stats/top-artists?limit=1&time_range=long_term&id=id`,
  next: `${mockEnvVariables.host}/stats/top-artists?offset=1&limit=1&time_range=long_term&id=id`,
  previous: null,
};

const mockTopTrackItem: TopTrackItem = {
  album: {
    album_type: 'single',
    artists: [
      {
        external_urls: {
          spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/artistid`,
        },
        href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/artistid`,
        id: 'artistid',
        name: 'Artist Name',
        type: 'artist',
        uri: 'spotify:artist:artistid',
      },
    ],
    available_markets: ['AR'],
    external_urls: {
      spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/album/albumid`,
    },
    href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/albums/albumid`,
    id: 'albumid',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/image640',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/image300',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/image64',
        width: 64,
      },
    ],
    is_playable: true,
    name: 'Track Name',
    release_date: '2020-08-28',
    release_date_precision: 'day',
    total_tracks: 1,
    type: 'album',
    uri: 'spotify:album:id',
  },
  artists: [
    {
      external_urls: {
        spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/id`,
      },
      href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/id`,
      id: '31Wb354M8kymhMPAvwF7I4',
      name: 'Artist name',
      type: 'artist',
      uri: 'spotify:artist:id',
    },
  ],
  available_markets: ['AR'],
  disc_number: 1,
  duration_ms: 164750,
  explicit: false,
  external_ids: {
    isrc: 'isrcid',
  },
  external_urls: {
    spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/track/id`,
  },
  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/tracks/id`,
  id: 'trackid',
  is_local: false,
  is_playable: true,
  name: 'Track Name',
  popularity: 57,
  preview_url: null,
  track_number: 1,
  type: 'track',
  uri: 'spotify:track:id',
};

const mockTopTrackItemRank: TopTrackItem = {
  ...mockTopTrackItem,
  rank_number: 1,
};

export const mockTopTrack: ITopTrackData = {
  items: [mockTopTrackItem],
  total: 5547,
  limit: 1,
  offset: 0,
  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-tracks?limit=1&time_range=long_term&id=trackid`,
  next: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-tracks?offset=1&limit=1&time_range=long_term&id=trackid`,
  previous: null,
};

export const mockTopTrackRank: ITopTrackData = {
  items: [mockTopTrackItemRank],
  total: 5547,
  limit: 1,
  offset: 0,
  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-tracks?limit=1&time_range=long_term&id=trackid`,
  next: `${mockEnvVariables.spotifyApi.hostApiSpotify}/stats/top-tracks?offset=1&limit=1&time_range=long_term&id=trackid`,
  previous: null,
};

export const mockTopTrackFormatted: ITopTrackData = {
  items: [mockTopTrackItemRank],
  total: 5547,
  limit: 1,
  offset: 0,
  href: `${mockEnvVariables.host}/stats/top-tracks?limit=1&time_range=long_term&id=trackid`,
  next: `${mockEnvVariables.host}/stats/top-tracks?offset=1&limit=1&time_range=long_term&id=trackid`,
  previous: null,
};

const mockTrackPlayed: TrackPlayed = {
  track: {
    album: {
      album_type: 'album',
      artists: [
        {
          external_urls: {
            spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/id`,
          },
          href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/id`,
          id: 'id',
          name: 'Artist Name',
          type: 'artist',
          uri: 'spotify:artist:id',
        },
      ],
      available_markets: ['AR'],
      external_urls: {
        spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/album/id`,
      },
      href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/albums/id`,
      id: 'id',
      images: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/id640',
          width: 640,
        },
        {
          height: 300,
          url: 'https://i.scdn.co/image/id300',
          width: 300,
        },
        {
          height: 64,
          url: 'https://i.scdn.co/image/id64',
          width: 64,
        },
      ],
      name: 'Album',
      release_date: '2009-08-20',
      release_date_precision: 'day',
      total_tracks: 10,
      type: 'album',
      uri: 'spotify:album:id',
    },
    artists: [
      {
        external_urls: {
          spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/id`,
        },
        href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/id`,
        id: 'id',
        name: 'Artist Name',
        type: 'artist',
        uri: 'spotify:artist:id',
      },
    ],
    available_markets: ['AR'],
    disc_number: 1,
    duration_ms: 283493,
    explicit: false,
    external_ids: {
      isrc: 'isrcid',
    },
    external_urls: {
      spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/track/id`,
    },
    href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/tracks/id`,
    id: 'id',
    is_local: false,
    name: 'Track Name',
    popularity: 61,
    preview_url: null,
    track_number: 8,
    type: 'track',
    uri: 'spotify:track:id',
  },
  played_at: '2025-04-26T20:29:57.529Z',
  context: null,
};

export const mockRecentlyPlayed: IRecentlyPlayedData = {
  items: [mockTrackPlayed],
  next: `${mockEnvVariables.spotifyApi.hostApiSpotify}/api/v1/stats/recently-played?before=before&limit=1&id=trackid`,
  cursors: {
    after: '1745699397529',
    before: '1745699397529',
  },
  limit: 1,
  href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/api/v1/stats/recently-played?limit=1&id=trackid`,
};

export const mockRecentlyPlayedFormatted: IRecentlyPlayedData = {
  items: [mockTrackPlayed],
  next: `${mockEnvVariables.host}/api/v1/stats/recently-played?before=before&limit=1&id=trackid`,
  cursors: {
    after: '1745699397529',
    before: '1745699397529',
  },
  limit: 1,
  href: `${mockEnvVariables.host}/api/v1/stats/recently-played?limit=1&id=trackid`,
};

export const mockCurrentlyPlaying: ICurrentlyPlaying = {
  timestamp: 1745711636450,
  context: null,
  progress_ms: 24764,
  item: {
    album: {
      album_type: 'album',
      artists: [
        {
          external_urls: {
            spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/id`,
          },
          href: '$mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/id',
          id: 'id',
          name: 'Artist Name',
          type: 'artist',
          uri: 'spotify:artist:id',
        },
      ],
      available_markets: ['AR'],
      external_urls: {
        spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/album/5IEoiwkThhRmSMBANhpxl2`,
      },
      href: '$mockEnvVariables.spotifyApi.hostApiSpotify}/v1/albums/5IEoiwkThhRmSMBANhpxl2',
      id: 'artist id',
      images: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/image640',
          width: 640,
        },
        {
          height: 300,
          url: 'https://i.scdn.co/image/image300',
          width: 300,
        },
        {
          height: 64,
          url: 'https://i.scdn.co/image/image64',
          width: 64,
        },
      ],
      name: 'Album name',
      release_date: '2009-08-20',
      release_date_precision: 'day',
      total_tracks: 10,
      type: 'album',
      uri: 'spotify:album:id',
    },
    artists: [
      {
        external_urls: {
          spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/artist/id`,
        },
        href: '$mockEnvVariables.spotifyApi.hostApiSpotify}/v1/artists/id',
        id: 'id',
        name: 'Artist Name',
        type: 'artist',
        uri: 'spotify:artist:id',
      },
    ],
    available_markets: ['AR'],
    disc_number: 1,
    duration_ms: 283493,
    explicit: false,
    external_ids: {
      isrc: 'iscrid',
    },
    external_urls: {
      spotify: `${mockEnvVariables.spotifyApi.hostApiSpotify}/track/id`,
    },
    href: `${mockEnvVariables.spotifyApi.hostApiSpotify}/v1/tracks/id`,
    id: 'id',
    is_local: false,
    name: 'Track Name',
    popularity: 61,
    preview_url: null,
    track_number: 8,
    type: 'track',
    uri: 'spotify:track:id',
  },
  currently_playing_type: 'track',
  actions: {
    disallows: {
      resuming: true,
      skipping_prev: true,
    },
  },
  is_playing: true,
};

export const mockResCurrentlyPlaying = {
  data: mockCurrentlyPlaying,
  status: 200,
  statusText: 'ok',
};

export const mockResGetCurrentlyPlaying = {
  statusCode: mockResCurrentlyPlaying.status,
  message: mockResCurrentlyPlaying.statusText,
  data: mockResCurrentlyPlaying.data,
};
