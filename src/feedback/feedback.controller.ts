import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Req,
  Res,
  Sse,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request, Response } from 'express';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const feedbackEvents = new Subject<string>();

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Sse('events')
  events(@Res() res: Response): Observable<MessageEvent> {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    return feedbackEvents.pipe(
      map((data) => ({ data } as MessageEvent)),
    );
  }

  @Get()
  @Render('feedback')
  async findAll(@Req() req: Request) {
    const s = (req as any).session;
    const feedbacks = await this.feedbackService.findAll();

    return {
      feedbacks,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: s?.username === 'Агата',
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() body: { message: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const s = (req as any).session;
    await this.feedbackService.create(s.userId, body.message);
    feedbackEvents.next(`Добавлен новый отзыв от ${s.username}`);
    return res.redirect('/feedback');
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const s = (req as any).session;
    const feedback = await this.feedbackService.findAll().then(f => f.find(fb => fb.id === Number(id)));
    if (!feedback || (feedback.userId !== s.userId && s.username !== 'Агата')) {
      throw new ForbiddenException('Нет доступа');
    }
    await this.feedbackService.remove(Number(id));
    return res.redirect('/feedback');
  }
}
