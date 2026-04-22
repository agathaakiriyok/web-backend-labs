import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const role = (req.session as any)?.role;

    if (role !== 'ADMIN') {
      res.redirect('/exhibitions');
      return false;
    }

    return true;
  }
}
