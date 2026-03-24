import { Controller, Get, Post, Body, Param, Redirect, Render, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('users/index')
  async findAll(@Query('auth') auth?: string) {
    const users = await this.userService.findAll();
    return { users, isAuth: auth === 'true', username: 'Агата' };
  }

  @Get('add')
  @Render('users/add')
  addForm(@Query('auth') auth?: string) {
    return { isAuth: auth === 'true', username: 'Агата' };
  }

  @Post()
  @Redirect('/users')
  async create(@Body() body: any) {
    await this.userService.create(body);
    return { url: '/users' };
  }

  @Post(':id/delete')
  @Redirect('/users')
  async remove(@Param('id') id: string) {
    await this.userService.remove(Number(id));
    return { url: '/users' };
  }
}