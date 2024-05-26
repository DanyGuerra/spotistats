import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthLogDto } from 'src/auth/create-auth-log.dto';
import { AuthLog } from 'src/auth/auth-log.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as qs from 'querystring';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('AuthLog') private readonly authLogModel: Model<AuthLog>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  createNewLog(createAuthLogDto: CreateAuthLogDto): Promise<AuthLog> {
    const createdCar = new this.authLogModel(createAuthLogDto);
    return createdCar.save();
  }

  async createUserToken(authLog: AuthLog): Promise<AuthLog> {
    const hostAccountsApiSpotify = this.configService.get<string>(
      'hostAccountsApiSpotify',
    );
    const redirectUriCallback = this.configService.get<string>(
      'redirectUriCallback',
    );

    const urlEncodedData = qs.stringify({
      grant_type: 'authorization_code',
      redirect_uri: redirectUriCallback,
      code: authLog.code,
    });

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${hostAccountsApiSpotify}token`, urlEncodedData)
        .pipe(
          catchError((error) => {
            const {
              response: { data },
            } = error;

            throw new InternalServerErrorException(data.error_description);
          }),
        ),
    );

    return data;
  }

  async updateLog(id: string, authLog: CreateAuthLogDto) {
    const updateLog = await this.authLogModel
      .findByIdAndUpdate(id, authLog, { new: true })
      .exec();

    if (!updateLog) {
      throw new NotFoundException('Log not found');
    }

    return updateLog;
  }
}
