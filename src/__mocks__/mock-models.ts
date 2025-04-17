import { CreateAuthLogDto } from 'src/common/dto/create-auth-log.dto';

export const mockCreateAuthLogDto: CreateAuthLogDto = {
  code: 'auth-code',
  refreshToken: 'refresh-token',
  accessToken: 'access-token',
};

export const mockSavedLog = {
  ...mockCreateAuthLogDto,
  _id: 'mock-id',
  save: jest.fn(),
};

export const mockAuthLogModel = jest.fn().mockImplementation(() => ({
  save: jest.fn().mockResolvedValue(mockSavedLog),
}));
