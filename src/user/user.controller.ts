import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('users/index')
  async findAll(@Req() req: Request) {
    const users = await this.userService.findAll();
    const s = (req as any).session;

    return {
      users,
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard)
  @Render('users/add')
  addForm(@Req() req: Request) {
    const s = (req as any).session;

    return {
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Redirect('/users')
  async create(@Body() body: any) {
    await this.userService.create(body);
    return { url: '/users' };
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  @Redirect('/users')
  async remove(@Param('id') id: string) {
    await this.userService.remove(Number(id));
    return { url: '/users' };
  }
}