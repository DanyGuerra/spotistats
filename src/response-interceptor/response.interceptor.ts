import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { SuccessResponse } from './response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    const includeData = this.reflector.get<boolean>(
      'includeData',
      context.getHandler(),
    );

    const messageResponse = this.reflector.get<string>(
      'messageResponse',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        const responseObject: SuccessResponse = {
          statusCode: response.statusCode,
          message: messageResponse || 'success',
        };
        if (includeData !== false) {
          responseObject.data = data;
        }

        return responseObject;
      }),
    );
  }
}
