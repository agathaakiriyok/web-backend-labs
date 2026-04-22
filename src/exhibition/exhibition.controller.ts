import { ApiExcludeController } from '@nestjs/swagger';
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
import { PrismaService } from '../prisma.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response, Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

const exhibitionEvents = new Subject<string>();

@ApiExcludeController()
@Controller('exhibitions')
export class ExhibitionController {
  constructor(
    private readonly exhibitionService: ExhibitionService,
    private readonly prisma: PrismaService,
  ) {}

  private session(req: Request) {
    const s = (req as any).session;
    return { isAuth: !!s?.userId, username: s?.username, isAdmin: s?.role === 'ADMIN' };
  }

  private fmtDate(d: Date) {
    return new Date(d).toISOString().split('T')[0];
  }

  @Get()
  @Render('exhibitions/index')
  async findAll(@Req() req: Request) {
    const exhibitions = await this.exhibitionService.findAll();
    const sess = this.session(req);
    return {
      exhibitions,
      ...sess,
      canBuy: sess.isAuth && !sess.isAdmin,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard, AdminGuard)
  @Render('exhibitions/add')
  async addForm(@Req() req: Request) {
    const halls = await this.prisma.hall.findMany();
    return { halls, ...this.session(req) };
  }

  @Sse('events')
  events(@Res() res: Response): Observable<MessageEvent> {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    return exhibitionEvents.pipe(map((data) => ({ data } as MessageEvent)));
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, AdminGuard)
  @Render('exhibitions/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const exhibition = await this.exhibitionService.findOne(Number(id));
    const halls = await this.prisma.hall.findMany();
    const sess = this.session(req);

    return {
      exhibition: exhibition
        ? {
            ...exhibition,
            dateStartInput: this.fmtDate(exhibition.dateStart),
            dateEndInput: this.fmtDate(exhibition.dateEnd),
          }
        : null,
      halls,
      ...sess,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const exhibition = await this.exhibitionService.findOne(Number(id));

    if (!exhibition) {
      return res.redirect('/exhibitions');
    }

    const sess = this.session(req);
    return res.render('exhibitions/show', {
      exhibition,
      ...sess,
      canBuy: sess.isAuth && !sess.isAdmin,
    });
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/exhibitions')
  async create(@Body() body: any) {
    await this.exhibitionService.create(body);
    exhibitionEvents.next(JSON.stringify({ type: 'create', name: body.name }));
    return { url: '/exhibitions' };
  }

  @Post(':id/update')
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/exhibitions')
  async update(@Param('id') id: string, @Body() body: any) {
    await this.exhibitionService.update(Number(id), body);
    exhibitionEvents.next(JSON.stringify({ type: 'update', name: body.name }));
    return { url: '/exhibitions' };
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard, AdminGuard)
  @Redirect('/exhibitions')
  async remove(@Param('id') id: string) {
    await this.exhibitionService.remove(Number(id));
    exhibitionEvents.next(JSON.stringify({ type: 'delete' }));
    return { url: '/exhibitions' };
  }
}
