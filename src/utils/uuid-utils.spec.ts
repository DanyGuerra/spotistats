import { mockUUID } from 'src/__mocks__/mock-utils';
import { generateShortUUID } from 'src/utils/uuid-utils';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('generateShortUUID', () => {
  it('should generate a short UUID of the specified length', () => {
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);

    const result = generateShortUUID(16);
    expect(result).toHaveLength(16);
    expect(result).toBe('1234567812345678');
  });
});
