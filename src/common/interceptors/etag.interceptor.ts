import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, EMPTY, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createHash } from 'crypto';
import type { Request, Response } from 'express';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') return next.handle();

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    if (req.method !== 'GET' || !req.path.startsWith('/api/')) {
      return next.handle();
    }

    return next.handle().pipe(
      switchMap((data) => {
        if (data == null || res.headersSent) return of(data);

        const body = JSON.stringify(data);
        const etag = `"${createHash('sha256').update(body).digest('hex').slice(0, 27)}"`;

        res.setHeader('ETag', etag);

        if (req.headers['if-none-match'] === etag) {
          res.status(304).end();
          return EMPTY;
        }

        return of(data);
      }),
    );
  }
}
