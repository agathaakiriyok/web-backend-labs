import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const info = (req as any).authInfo ?? {};

    if (!info.isAuth) {
      res.redirect('/auth/login');
      return false;
    }

    if (!info.isAdmin) {
      res.redirect('/exhibitions');
      return false;
    }

    return true;
  }
}
