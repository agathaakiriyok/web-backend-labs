import { Controller, Get, Render, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiExcludeController()

@Controller()
export class AppController {
  private session(req: Request) {
    const s = (req as any).session;
    return {
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: s?.role === 'ADMIN',
    };
  }

  @Get()
  @Render('index')
  getIndex(@Req() req: Request) {
    return {
      ...this.session(req),
      exhibitions: [
        { name: 'Искусство портрета', date: '10 ноября – 20 декабря' },
        { name: '14 декабря 1825 года', date: '10 ноября – 20 декабря' },
        { name: 'Музейный детектив', date: '1 декабря – 15 января' },
      ],
    };
  }

  @Get('about')
  @Render('about')
  getAbout(@Req() req: Request) {
    return this.session(req);
  }

  @Get('all-exhibitions')
  @Render('all-exhibitions')
  getAllExhibitions(@Req() req: Request) {
    return this.session(req);
  }
}
