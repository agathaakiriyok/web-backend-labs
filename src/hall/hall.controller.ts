import { Controller, Get, Post, Body, Param, Redirect, Render, Query } from '@nestjs/common';
import { HallService } from './hall.service';

@Controller('halls')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get()
  @Render('halls/index')
  async findAll(@Query('auth') auth?: string) {
    const halls = await this.hallService.findAll();
    return { halls, isAuth: auth === 'true', username: 'Агата' };
  }

  @Get('add')
  @Render('halls/add')
  addForm(@Query('auth') auth?: string) {
    return { isAuth: auth === 'true', username: 'Агата' };
  }

  @Post()
  @Redirect('/halls')
  async create(@Body() body: any) {
    await this.hallService.create(body);
    return { url: '/halls' };
  }

  @Post(':id/delete')
  @Redirect('/halls')
  async remove(@Param('id') id: string) {
    await this.hallService.remove(Number(id));
    return { url: '/halls' };
  }
}