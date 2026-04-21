import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  loginForm() {
    return {};
  }

  @Post('login')
  async login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    const user = await this.authService.login(body.name);

    if (!user) {
      return res.render('auth/login', { error: true, isAuth: false });
    }

    const s = (req as any).session;
    s.userId = user.id;
    s.username = user.name;

    return res.redirect('/exhibitions');
  }

  @Get('register')
  @Render('auth/register')
  registerForm() {
    return {};
  }

  @Post('register')
  async register(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    if (!body.name || !body.email || !body.password) {
      return res.render('auth/register', {
        error: 'Заполните все поля',
        isAuth: false,
      });
    }

    const user = await this.authService.register(body.name, body.email, body.password);

    if (!user) {
      return res.render('auth/register', {
        error: 'Пользователь с таким именем или email уже существует',
        isAuth: false,
      });
    }

    const s = (req as any).session;
    s.userId = user.id;
    s.username = user.name;

    return res.redirect('/exhibitions');
  }

  @Get('logout')
  async logoutGet(@Req() req: Request, @Res() res: Response) {
    return this.doLogout(req, res);
  }

  @Post('logout')
  async logoutPost(@Req() req: Request, @Res() res: Response) {
    return this.doLogout(req, res);
  }

  private doLogout(req: Request, res: Response) {
    const s = (req as any).session;
    s.destroy((err: any) => {
      if (err) return res.redirect('/exhibitions');
      res.redirect('/auth/login');
    });
  }
}
