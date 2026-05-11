import { ApiExcludeController } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  loginForm() {
    return {};
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const body: any = req.body ?? {};
    const user = await this.authService.login(body.email, body.password, res);

    if (!user) {
      return res.render('auth/login', { error: true, isAuth: false });
    }

    return res.redirect('/exhibitions');
  }

  @Get('register')
  @Render('auth/register')
  registerForm() {
    return {};
  }

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const body: any = req.body ?? {};
    if (!body.name || !body.email || !body.password) {
      return res.render('auth/register', {
        error: 'Заполните все поля',
        isAuth: false,
      });
    }

    const result = await this.authService.register(body.name, body.email, body.password, res);

    if (!result || 'error' in result) {
      const msg =
        result?.error === 'exists'
          ? 'Пользователь с таким email уже зарегистрирован'
          : result?.error === 'weak_password'
            ? 'Пароль слишком короткий — минимум 6 символов'
            : 'Ошибка регистрации. Проверьте данные и попробуйте снова';
      return res.render('auth/register', { error: msg, isAuth: false });
    }

    return res.redirect('/exhibitions');
  }

  @Get('logout')
  logoutGet(@Req() req: Request, @Res() res: Response) {
    this.authService.clearSessionCookie(res);
    res.redirect('/auth/login');
  }

  @Post('logout')
  logoutPost(@Req() req: Request, @Res() res: Response) {
    this.authService.clearSessionCookie(res);
    res.redirect('/auth/login');
  }
}
