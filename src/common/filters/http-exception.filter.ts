import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message ?? exception.message;

    if (req.path.startsWith('/api/')) {
      res.status(status).json({
        statusCode: status,
        message,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    } else {
      if (status === 401 || status === 403) {
        return res.redirect('/auth/login');
      }
      if (status === 404) {
        return res.redirect('/exhibitions');
      }
      res.redirect('/exhibitions');
    }
  }
}
