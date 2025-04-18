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

export const mockUpdatedLog = {
  ...mockCreateAuthLogDto,
  _id: 'mock-id',
};

export const mockAuthId = 'mock-id';
export const idNotFound = 'non-existent-id';
export const updatedLog = { ...mockCreateAuthLogDto, _id: mockAuthId };

export const mockAuthLogInstance = {
  save: jest.fn().mockResolvedValue(mockSavedLog),
};

export const mockReturnValueFindOne = (authLogMock) => ({
  sort: jest
    .fn()
    .mockReturnValue({ exec: jest.fn().mockResolvedValue(authLogMock) }),
});

export const mockAuthLogModel: any = jest
  .fn()
  .mockImplementation(() => mockAuthLogInstance);

mockAuthLogModel.findByIdAndUpdate = jest.fn();
mockAuthLogModel.findById = jest.fn();
mockAuthLogModel.findOne = jest.fn();
mockAuthLogModel.findByIdAndDelete = jest.fn();
