import {
  mockId,
  mockReplacementUrl,
  mockTargetUrl,
  mockUrl,
} from 'src/__mocks__/mock-utils';
import { addRankingNumbers, formatPaginationUrls, urlReplace } from './utils';
import {
  mockTopArtists,
  mockTopArtistsFormatted,
  mockTopArtistsRank,
} from 'src/stats/__mocks__/mock-stats';
import { ITopArtistData } from 'src/common/interfaces/IResponseTopArtists';

urlReplace;

describe('Utils', () => {
  it('Should replace the url and add id', () => {
    const result = urlReplace(
      mockId,
      mockUrl,
      mockTargetUrl,
      mockReplacementUrl,
    );

    expect(result).toEqual(`${mockReplacementUrl}&id=${mockId}`);
  });

  it('should return null if the URL is null', () => {
    const result = urlReplace(mockUrl, null, mockTargetUrl, mockReplacementUrl);
    expect(result).toBeNull();
  });

  it('should return rank_number key value', () => {
    const result = addRankingNumbers<ITopArtistData>(mockTopArtists);
    expect(result).toEqual(mockTopArtistsRank);
  });

  it('should return pagination urls formatted', () => {
    const result = formatPaginationUrls(
      mockTopArtistsRank,
      mockId,
      mockTargetUrl,
      mockReplacementUrl,
    );

    expect(result).toEqual(mockTopArtistsFormatted);
  });
});
