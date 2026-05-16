import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const info = (req as any).authInfo ?? {};
    if (!info.isAuth) {
      res.redirect('/auth/login');
      return;
    }
    next();
  }
}
