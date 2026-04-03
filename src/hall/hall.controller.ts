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
import { HallService } from './hall.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('halls')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get()
  @Render('halls/index')
  async findAll(@Req() req: Request) {
    const halls = await this.hallService.findAll();
    const s = (req as any).session;

    return {
      halls,
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard)
  @Render('halls/add')
  addForm(@Req() req: Request) {
    const s = (req as any).session;

    return {
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Redirect('/halls')
  async create(@Body() body: any) {
    await this.hallService.create(body);
    return { url: '/halls' };
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  @Redirect('/halls')
  async remove(@Param('id') id: string) {
    await this.hallService.remove(Number(id));
    return { url: '/halls' };
  }
}