import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class SessionContextMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const session = await this.authService.verifySession(req);

    if (session) {
      (req as any).authInfo = {
        isAuth: true,
        userId: session.userId,
        username: session.name,
        role: session.role,
        isAdmin: session.role === 'ADMIN',
      };
    } else {
      (req as any).authInfo = { isAuth: false };
    }

    next();
  }
}
