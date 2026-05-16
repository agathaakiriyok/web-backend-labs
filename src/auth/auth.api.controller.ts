import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Войти (установить сессионный cookie)' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ schema: { example: { id: 1, name: 'qwerty', role: 'USER' } } })
  @ApiResponse({ status: 401, description: 'Неверное имя или пароль' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = await this.authService.login(dto.name, dto.password);
    if (!user) throw new UnauthorizedException('Неверное имя или пароль');

    const s = (req as any).session;
    s.userId = user.id;
    s.username = user.name;
    s.role = user.role;

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  @Post('register')
  @ApiOperation({ summary: 'Зарегистрироваться и войти' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, schema: { example: { id: 9, name: 'newuser', role: 'USER' } } })
  @ApiResponse({ status: 409, description: 'Имя или email уже заняты' })
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(dto.name, dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Пользователь с таким именем или email уже существует');
    }

    const s = (req as any).session;
    s.userId = user.id;
    s.username = user.name;
    s.role = user.role;

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Выйти (уничтожить сессию)' })
  @ApiOkResponse({ schema: { example: { message: 'Выход выполнен' } } })
  async logout(@Req() req: Request) {
    await new Promise<void>((resolve) => (req as any).session.destroy(() => resolve()));
    return { message: 'Выход выполнен' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiOkResponse({ schema: { example: { id: 1, name: 'qwerty', role: 'USER' } } })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async me(@Req() req: Request) {
    const s = (req as any).session;
    return { id: s.userId, name: s.username, role: s.role };
  }
}
