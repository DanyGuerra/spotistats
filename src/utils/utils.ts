import { IResponseRecentlyPlayed } from 'src/common/interfaces/IResponseRecentlyPlayed';
import { IResponseTopArtists } from 'src/common/interfaces/IResponseTopArtists';
import { IResponseTopTracks } from 'src/common/interfaces/IResponseTopTracks';

type IResponseTopItems =
  | IResponseTopArtists
  | IResponseTopTracks
  | IResponseRecentlyPlayed;

export const urlReplace = (
  id,
  url: string,
  target: string,
  replacement: string,
): string => {
  if (url === null) {
    return null;
  }

  const urlFormatted = url.replace(target, replacement);

  return `${urlFormatted}&id=${id}`;
};

export const addRankingNumbers = <
  T extends IResponseTopArtists | IResponseTopTracks,
>(
  data: T,
): T => {
  const copyData = { ...data };
  copyData.items = data.items.map((item, index) => ({
    ...item,
    rank_number: data.offset + index + 1,
  }));

  return copyData;
};

export const formatPaginationUrls = <T extends IResponseTopItems>(
  data: T,
  id: string,
  spotifyUrl: string,
  appUrl: string,
): T => {
  const copyData = { ...data };
  const keys: Array<'href' | 'next' | 'previous'> = [
    'href',
    'next',
    'previous',
  ];

  keys.forEach((key) => {
    if (copyData[key]) {
      copyData[key] = urlReplace(id, copyData[key], spotifyUrl, appUrl);
    }
  });

  return copyData;
};
