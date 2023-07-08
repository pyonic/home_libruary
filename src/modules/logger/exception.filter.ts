import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from './logger.service';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService: CustomLoggerService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.statusCode = status;

    await this.loggerService.logRequest(request, response, {
      error: true,
      details: exception.message,
    });

    const error: any = exception.getResponse();

    response.status(status).json({
      timestamp: Date.now(),
      message: error.message,
    });
  }
}
