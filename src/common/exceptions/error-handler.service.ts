import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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

    const { data } = error.response;

    throw new InternalServerErrorException(data);
  }
}
