import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from 'src/common/exceptions/error-handler.service';
import { getLoggerToken } from 'nestjs-pino';

const mockAuthLogModel = {
  save: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findOne: jest.fn(),
};

const mockHttpCustomService = {
  post: jest
    .fn()
    .mockResolvedValue({ data: { access_token: 'mock-access-token' } }),
};

const mockConfigService = {
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

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: getModelToken(AuthLog.name),
          useValue: mockAuthLogModel,
        },
        { provide: HttpCustomService, useValue: mockHttpCustomService },
        { provide: ErrorHandlerService, useValue: {} },
        {
          provide: getLoggerToken(AuthService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
