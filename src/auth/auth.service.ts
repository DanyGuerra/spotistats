import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthLogDto } from 'src/common/dto/create-auth-log.dto';
import { AuthLog } from 'src/auth/auth-logs.schema';
import { firstValueFrom } from 'rxjs';
import * as qs from 'querystring';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IResponseAccessToken } from 'src/common/interfaces/IResponseAccessToken';
import { AxiosResponse } from 'axios';
import { IRequestToken } from 'src/common/interfaces/IRequestAccessToken';
import { IRequestRefreshToken } from 'src/common/interfaces/IRequestRefreshToken';
import { HttpCustomService } from 'src/common/CustomHttp/custom-http.service';

@Injectable()
export class AuthService {
  private hostAccountsApiSpotify: string;
  private redirectUriCallback: string;
  private apiClientId: string;

  constructor(
    @InjectModel('AuthLog') private readonly authLogModel: Model<AuthLog>,
    private readonly httpService: HttpCustomService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(AuthService.name) private readonly logger: PinoLogger,
  ) {
    const { hostAccountsApiSpotify, redirectUriCallback, apiSptifyClientId } =
      this.configService.get<{
        hostAccountsApiSpotify: string;
        redirectUriCallback: string;
        apiSptifyClientId: string;
      }>('spotifyApi');

    this.hostAccountsApiSpotify = hostAccountsApiSpotify;
    this.redirectUriCallback = redirectUriCallback;
    this.apiClientId = apiSptifyClientId;
  }

  async apiTokenRequest(
    urlEncodedData: string,
  ): Promise<AxiosResponse<IResponseAccessToken>> {
    return firstValueFrom(
      this.httpService.post<IResponseAccessToken>(
        `${this.hostAccountsApiSpotify}/api/token`,
        urlEncodedData,
      ),
    );
  }

  async createNewLog(createAuthLogDto: CreateAuthLogDto): Promise<AuthLog> {
    this.logger.info('Starting create new log...');
    const createdAuth = new this.authLogModel(createAuthLogDto);
    const savedAuth = createdAuth.save();
    this.logger.info('End create new log');
    return savedAuth;
  }

  async createUserToken(authLog: AuthLog): Promise<IResponseAccessToken> {
    this.logger.info('Starting create user token...');

    const dataRequestToken: IRequestToken = {
      grant_type: 'authorization_code',
      code: authLog.code,
      redirect_uri: this.redirectUriCallback,
    };

    const urlEncodedData = qs.stringify(dataRequestToken);

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

  async getAuthLogByUserId(userId: string): Promise<AuthLog> {
    this.logger.info('Starting get AuthLogByUserId...');

    const authLog = await this.authLogModel
      .findOne<AuthLog>({ usernameId: userId })
      .sort({ createdAt: -1 })
      .exec();

    if (!authLog) {
      this.logger.error('Log not found');
      throw new NotFoundException('Log not found');
    }

    this.logger.info('End get AuthLogByUserId...');

    return authLog;
  }

  async updateAuthToken(id: string): Promise<AuthLog> {
    this.logger.info('Starting update auth token...');

    const actualAuthLog = await this.getAuthLog(id);

    const dataRequestRefreshToken: IRequestRefreshToken = {
      grant_type: 'refresh_token',
      refresh_token: actualAuthLog.refreshToken,
      client_id: this.apiClientId,
    };

    const urlEncodedData = qs.stringify(dataRequestRefreshToken);

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

  async deleteAuthLog(id: string): Promise<AuthLog> {
    this.logger.info('Starting delete auth log...');

    const authLog = await this.authLogModel
      .findByIdAndDelete<AuthLog>(id)
      .exec();

    if (!authLog) {
      this.logger.error('Log not found');
      throw new NotFoundException('Log not found');
    }

    this.logger.info('End delete authlog');

    return authLog;
  }
}
