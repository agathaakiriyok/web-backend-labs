import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const s = (req as any).session;
    if (!s?.userId) {
      return res.redirect('/auth/login');
    }
    next();
  }
}
