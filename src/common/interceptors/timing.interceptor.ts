import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    if (context.getType<string>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext<{ req: Request; res: Response }>();

      return next.handle().pipe(
        map((data) => {
          const elapsed = Date.now() - start;
          this.logger.log(`[GraphQL] ${gqlCtx.getInfo().fieldName} → ${elapsed}ms`);
          if (ctx?.res && !ctx.res.headersSent) {
            ctx.res.setHeader('X-Elapsed-Time', String(elapsed));
          }
          return data;
        }),
      );
    }

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const isApi = req.path.startsWith('/api/');

    return next.handle().pipe(
      map((data) => {
        const elapsed = Date.now() - start;
        this.logger.log(`[${req.method}] ${req.path} → ${elapsed}ms`);

        if (isApi) {
          if (!res.headersSent) {
            res.setHeader('X-Elapsed-Time', String(elapsed));
          }
          return data;
        }

        // Page rendering: inject server elapsed time into Handlebars template context
        if (data && typeof data === 'object' && !Buffer.isBuffer(data)) {
          return { ...data, serverElapsedTime: elapsed };
        }
        return data;
      }),
    );
  }
}
