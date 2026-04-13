import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  Sse,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response, Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

const exhibitionEvents = new Subject<string>();

@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  private isAdmin(username?: string) {
    return username === 'Агата';
  }

  @Get()
  @Render('exhibitions/index')
  async findAll(@Req() req: Request) {
    const exhibitions = await this.exhibitionService.findAll();
    const s = (req as any).session;
    const isAdmin = this.isAdmin(s?.username);

    return {
      exhibitions,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin,
      canBuy: !!s?.userId && !isAdmin,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard, AdminGuard)
  @Render('exhibitions/add')
  addForm(@Req() req: Request) {
    const s = (req as any).session;

    return {
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: true,
    };
  }

  @Sse('events')
  events(@Res() res: Response): Observable<MessageEvent> {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    return exhibitionEvents.pipe(
      map((data) => ({ data } as MessageEvent)),
    );
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, AdminGuard)
  @Render('exhibitions/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const exhibition = await this.exhibitionService.findOne(Number(id));
    const s = (req as any).session;

    return {
      exhibition,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: true,
    };
  }

  @Get(':id')
  @Render('exhibitions/show')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const exhibition = await this.exhibitionService.findOne(Number(id));
    const s = (req as any).session;
    const isAdmin = this.isAdmin(s?.username);

    return {
      exhibition,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin,
      canBuy: !!s?.userId && !isAdmin,
    };
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/exhibitions')
  async create(@Body() body: any) {
    await this.exhibitionService.create(body);
    exhibitionEvents.next(`Добавлена выставка: ${body.name}`);
    return { url: '/exhibitions' };
  }

  @Post(':id/update')
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/exhibitions')
  async update(@Param('id') id: string, @Body() body: any) {
    await this.exhibitionService.update(Number(id), body);
    exhibitionEvents.next(`Обновлена выставка: ${body.name}`);
    return { url: '/exhibitions' };
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/exhibitions')
  async remove(@Param('id') id: string) {
    await this.exhibitionService.remove(Number(id));
    exhibitionEvents.next('Выставка удалена');
    return { url: '/exhibitions' };
  }
}