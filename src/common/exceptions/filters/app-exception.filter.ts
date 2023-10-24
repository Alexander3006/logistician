import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppExceptionType } from '../types';
import { AppException } from '../app.exception';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const result: AppExceptionType = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: `#${exception.getOwnCode()}`,
      solution: exception.getOwnSolution(),
      message: exception.message,
    };

    response.status(status).json(result);
  }
}
