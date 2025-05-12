import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IDefaultResponse } from '../interfaces/IDefaultResponse';
import { IResponseError } from '../interfaces/IResponseError';

@Injectable()
export class ErrorHandlerService {
  constructor(
    @InjectPinoLogger(ErrorHandlerService.name)
    private readonly logger: PinoLogger,
  ) {}

  handleError(error: any) {
    this.logger.error(error);

    if (error.isAxiosError) {
      const axiosError = error as AxiosError;

      if (!axiosError.response) {
        throw new InternalServerErrorException('Unexpected error occurred');
      }

      const data = axiosError.response.data as IResponseError;

      const errorResponse: IDefaultResponse = {
        statusCode: data?.error?.status || 500,
        message: data?.error?.message || 'Unknown Axios error',
      };

      switch (data?.error?.status) {
        case 401:
          throw new UnauthorizedException(errorResponse);
        case 400:
          throw new BadRequestException(errorResponse);
        default:
          throw new InternalServerErrorException(errorResponse);
      }
    }

    throw error;
  }
}
