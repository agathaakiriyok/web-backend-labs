import { ApiExcludeController } from '@nestjs/swagger';
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
import { AdminGuard } from '../auth/admin.guard';
import type { Request } from 'express';

@ApiExcludeController()
@Controller('halls')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  private session(req: Request) {
    const s = (req as any).authInfo;
    return { isAuth: !!s?.isAuth, username: s?.username, isAdmin: s?.isAdmin };
  }

  @Get()
  @Render('halls/index')
  async findAll(@Req() req: Request) {
    const halls = await this.hallService.findAll();
    return { halls, ...this.session(req) };
  }

  @Get('add')
  @UseGuards(AuthGuard, AdminGuard)
  @Render('halls/add')
  addForm(@Req() req: Request) {
    return this.session(req);
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, AdminGuard)
  @Render('halls/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const hall = await this.hallService.findOne(Number(id));
    return { hall, ...this.session(req) };
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/halls')
  async create(@Body() body: any) {
    await this.hallService.create(body);
    return { url: '/halls' };
  }

  @Post(':id/update')
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/halls')
  async update(@Param('id') id: string, @Body() body: any) {
    await this.hallService.update(Number(id), body);
    return { url: '/halls' };
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/halls')
  async remove(@Param('id') id: string) {
    await this.hallService.remove(Number(id));
    return { url: '/halls' };
  }
}
