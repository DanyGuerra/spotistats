import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

export const mockResponse = {
  statusCode: 200,
  message: 'success',
};

export const mockExecutionContext: Partial<ExecutionContext> = {
  switchToHttp: jest.fn().mockReturnValue({
    getResponse: jest
      .fn()
      .mockReturnValue(mockResponse as Partial<Response> as Response),
  }),
  getHandler: jest.fn(),
};

export const mockDataResponse = { data: 'test' };

export const mockCustomMessage = 'Custom Message';

export const mockCallHandler: Partial<CallHandler> = {
  handle: jest.fn().mockReturnValue(of(mockDataResponse)),
};
