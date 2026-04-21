import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response, Request } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Запись с такими данными уже существует';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Запись не найдена';
        break;
      case 'P2003':
        status = HttpStatus.CONFLICT;
        message = 'Нарушение ограничения внешнего ключа';
        break;
      case 'P2014':
        status = HttpStatus.CONFLICT;
        message = 'Нарушение связи между записями';
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Внутренняя ошибка базы данных';
        this.logger.error(`Unhandled Prisma error: ${exception.code}`, exception.message);
    }

    if (req.path.startsWith('/api/')) {
      res.status(status).json({
        statusCode: status,
        message,
        error: exception.code,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(status).redirect('/exhibitions');
    }
  }
}
