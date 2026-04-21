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

  private session(req: Request) {
    const s = (req as any).session;
    return {
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: s?.username === 'Агата',
    };
  }

  @Get()
  @Render('users/index')
  async findAll(@Req() req: Request) {
    const users = await this.userService.findAll();
    return { users, ...this.session(req) };
  }

  @Get('add')
  @UseGuards(AuthGuard)
  @Render('users/add')
  addForm(@Req() req: Request) {
    return this.session(req);
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard)
  @Render('users/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const user = await this.userService.findOne(Number(id));
    return { user, ...this.session(req) };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Redirect('/users')
  async create(@Body() body: any) {
    await this.userService.create(body);
    return { url: '/users' };
  }

  @Post(':id/update')
  @UseGuards(AuthGuard)
  @Redirect('/users')
  async update(@Param('id') id: string, @Body() body: any) {
    await this.userService.update(Number(id), body);
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
