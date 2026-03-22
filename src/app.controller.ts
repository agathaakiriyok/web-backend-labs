import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class AppController {

  private getSession(auth?: string) {
    const isAuth = auth === 'true';
    return {
      isAuth,
      username: isAuth ? 'Агата' : null,
    };
  }

  @Get()
  @Render('index')
  getIndex(@Query('auth') auth?: string) {
    return {
      ...this.getSession(auth),
      exhibitions: [
        { name: 'Искусство портрета', date: '10 ноября – 20 декабря' },
        { name: '14 декабря 1825 года', date: '10 ноября – 20 декабря' },
        { name: 'Музейный детектив', date: '1 декабря – 15 января' },
      ],
    };
  }

  @Get('about')
  @Render('about')
  getAbout(@Query('auth') auth?: string) {
    return this.getSession(auth);
  }

  @Get('tickets')
  @Render('tickets')
  getTickets(@Query('auth') auth?: string) {
    return this.getSession(auth);
  }

  @Get('feedback')
  @Render('feedback')
  getFeedback(@Query('auth') auth?: string) {
    return this.getSession(auth);
  }

  @Get('all-exhibitions')
  @Render('all-exhibitions')
  getAllExhibitions(@Query('auth') auth?: string) {
    return this.getSession(auth);
  }
}