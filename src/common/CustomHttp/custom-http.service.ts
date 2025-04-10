import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpCustomService {
  constructor(
    private readonly httpService: HttpService,
    @InjectPinoLogger(HttpCustomService.name)
    private readonly logger: PinoLogger,
  ) {}

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    this.logger.info(`GET ${url}`);
    this.logger.debug({ config });
    return this.httpService.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    this.logger.info(`POST ${url}`);
    this.logger.debug(`Config ${{ config }}`);
    this.logger.debug(`Data ${{ data }}`);
    return this.httpService.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    this.logger.info(`PUT ${url}`);
    this.logger.debug(`Config ${config}`);
    this.logger.debug(`Data ${data}`);
    return this.httpService.put<T>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    this.logger.info(`DELETE ${url}`);
    this.logger.debug(`Config ${config}`);
    return this.httpService.delete<T>(url, config);
  }
}
