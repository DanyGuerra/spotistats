import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthLogDto } from 'src/auth/dto/create-auth-log.dto';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as qs from 'querystring';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IResponseAccessToken } from 'src/common/interfaces/IResponseAccessToken';
import { IErrorResponse } from 'src/common/interfaces/IErrorResponse';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private hostAccountsApiSpotify: string;
  private redirectUriCallback: string;
  private apiClientId: string;

  constructor(
    @InjectModel('AuthLog') private readonly authLogModel: Model<AuthLog>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(AuthService.name) private readonly logger: PinoLogger,
  ) {
    const { hostAccountsApiSpotify, redirectUriCallback } =
      this.configService.get<{
        hostAccountsApiSpotify: string;
        redirectUriCallback: string;
        apiSptifyClientId: string;
      }>('spotifyApi');

    this.hostAccountsApiSpotify = hostAccountsApiSpotify;
    this.redirectUriCallback = redirectUriCallback;
  }

  async apiTokenRequest(
    urlEncodedData: string,
  ): Promise<AxiosResponse<IResponseAccessToken>> {
    return firstValueFrom(
      this.httpService
        .post<IResponseAccessToken>(
          `${this.hostAccountsApiSpotify}/api/token`,
          urlEncodedData,
        )
        .pipe(
          catchError((error) => {
            const {
              response: { data },
            }: { response: { data: IErrorResponse } } = error;

            this.logger.error(error);

            throw new InternalServerErrorException(data.error_description);
          }),
        ),
    );
  }

  createNewLog(createAuthLogDto: CreateAuthLogDto): Promise<AuthLog> {
    this.logger.info('Starting create new log...');
    const createdAuth = new this.authLogModel(createAuthLogDto);
    const savedAuth = createdAuth.save();
    this.logger.info('End create new log');
    return savedAuth;
  }

  async createUserToken(authLog: AuthLog): Promise<IResponseAccessToken> {
    this.logger.info('Starting create user token...');

    const urlEncodedData = qs.stringify({
      grant_type: 'authorization_code',
      code: authLog.code,
      redirect_uri: this.redirectUriCallback,
    });

    const { data } = await this.apiTokenRequest(urlEncodedData);

    this.logger.info('End create user token...');

    return data;
  }

  async updateLog(id: string, authLog: CreateAuthLogDto): Promise<AuthLog> {
    this.logger.info('Starting update log...');

    const updateLog = await this.authLogModel
      .findByIdAndUpdate<AuthLog>(id, authLog, { new: true })
      .exec();

    if (!updateLog) {
      this.logger.error('Log not found');
      throw new NotFoundException('Log not found');
    }

    this.logger.info('Ending update log...');

    return updateLog;
  }

  async getAuthLog(id: string): Promise<AuthLog> {
    this.logger.info('Starting get AuthLog...');

    const authLog = await this.authLogModel.findById<AuthLog>(id).exec();

    if (!authLog) {
      this.logger.error('Log not found');
      throw new NotFoundException('Log not found');
    }

    this.logger.info('End get AuthLog...');

    return authLog;
  }

  async updateAuthToken(id: string): Promise<AuthLog> {
    this.logger.info('Starting update auth token...');

    const actualAuthLog = await this.getAuthLog(id);

    const urlEncodedData = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: actualAuthLog.refreshToken,
      client_id: this.apiClientId,
    });

    const { data } = await this.apiTokenRequest(urlEncodedData);

    const authLog = await this.authLogModel
      .findByIdAndUpdate<AuthLog>(id, { accessToken: data.access_token })
      .exec();

    if (!authLog) {
      this.logger.error('Log not found');
      throw new NotFoundException('Log not found');
    }

    this.logger.info('End update auth token');

    return authLog;
  }
}
