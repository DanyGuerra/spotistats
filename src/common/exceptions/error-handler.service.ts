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

  handleError(error: AxiosError) {
    if (!error.response) {
      throw new InternalServerErrorException('Unexpected error occurred');
    }

    this.logger.error(error.response.data);

    const data = error.response.data as IResponseError;

    const errorResponse: IDefaultResponse = {
      statusCode: data.error.status,
      message: data.error.message,
    };

    if (data.error.status === 401) {
      throw new UnauthorizedException(errorResponse);
    } else if (data.error.status === 400) {
      throw new BadRequestException(errorResponse);
    }

    throw new InternalServerErrorException(errorResponse);
  }
}
