import { mockResponse } from './../__mocks__/mock-interceptor';
import { ResponseInterceptor } from './response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  mockCallHandler,
  mockCustomMessage,
  mockDataResponse,
  mockExecutionContext,
} from 'src/__mocks__/mock-interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new ResponseInterceptor(reflector);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return a response with data and a default message', (done) => {
    jest.spyOn(reflector, 'get').mockImplementation((key) => {
      if (key === 'includeData') return true;
      if (key === 'messageResponse') return mockCustomMessage;
    });

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe((result) => {
        expect(result).toEqual({
          ...mockResponse,
          message: mockCustomMessage,
          data: mockDataResponse,
        });
        done();
      });
  });

  it('should return a response without data if includeData is false', (done) => {
    jest.spyOn(reflector, 'get').mockImplementation((key) => {
      if (key === 'includeData') return false;
      if (key === 'messageResponse') return undefined;
    });

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });
  });
});
