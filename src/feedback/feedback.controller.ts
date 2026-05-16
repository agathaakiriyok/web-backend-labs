import { ApiExcludeController } from '@nestjs/swagger';
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

@ApiExcludeController()
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Sse('events')
  events(@Res() res: Response): Observable<MessageEvent> {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    return feedbackEvents.pipe(map((data) => ({ data } as MessageEvent)));
  }

  @Get()
  @Render('feedback')
  async findAll(@Req() req: Request) {
    const s = (req as any).session;
    const currentUserId: number | null = s?.userId ?? null;
    const isAdmin = s?.username === 'Агата';

    const raw = await this.feedbackService.findAll();
    const feedbacks = raw.map((fb) => ({
      ...fb,
      canEdit: fb.userId === currentUserId,
      canDelete: isAdmin || fb.userId === currentUserId,
    }));

    return {
      feedbacks,
      isAuth: !!currentUserId,
      username: s?.username,
      userId: currentUserId,
      isAdmin,
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
    const feedback = await this.feedbackService.create(s.userId, body.message);

    feedbackEvents.next(
      JSON.stringify({
        type: 'create',
        feedback: {
          id: feedback.id,
          text: feedback.text,
          userId: feedback.userId,
          userName: feedback.user.name,
          createdAt: feedback.createdAt,
        },
      }),
    );

    return res.redirect('/feedback');
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard)
  @Render('feedback/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const s = (req as any).session;
    const feedback = await this.feedbackService.findOne(Number(id));

    if (!feedback || (feedback.userId !== s.userId && s.username !== 'Агата')) {
      throw new ForbiddenException('Нет доступа');
    }

    return {
      feedback,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: s?.username === 'Агата',
    };
  }

  @Post(':id/update')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { message: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const s = (req as any).session;
    const feedback = await this.feedbackService.findOne(Number(id));

    if (!feedback || (feedback.userId !== s.userId && s.username !== 'Агата')) {
      throw new ForbiddenException('Нет доступа');
    }

    const updated = await this.feedbackService.update(Number(id), body.message);

    feedbackEvents.next(
      JSON.stringify({
        type: 'update',
        feedback: { id: updated.id, text: updated.text },
      }),
    );

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
    const feedback = await this.feedbackService.findOne(Number(id));

    if (!feedback || (feedback.userId !== s.userId && s.username !== 'Агата')) {
      throw new ForbiddenException('Нет доступа');
    }

    await this.feedbackService.remove(Number(id));
    feedbackEvents.next(JSON.stringify({ type: 'delete', id: Number(id) }));

    return res.redirect('/feedback');
  }
}
