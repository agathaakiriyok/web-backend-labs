import { Controller, Get, Post, Body, Param, Delete, Redirect, Render, Query, Sse } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const feedbackEvents = new Subject<string>();

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Sse('events')
  events(): Observable<MessageEvent> {
    return feedbackEvents.pipe(map((data) => ({ data } as MessageEvent)));
  }

  @Get()
  @Render('feedback')
  async findAll(@Query('auth') auth?: string) {
    const feedbacks = await this.feedbackService.findAll();
    return { feedbacks, isAuth: auth === 'true', username: 'Агата' };
  }

  @Post()
  @Redirect('/feedback')
  async create(@Body() body: any) {
    await this.feedbackService.create({ text: body.message, userId: 1 });
    feedbackEvents.next(`Новый отзыв добавлен`);
    return { url: '/feedback' };
  }

  @Post(':id/delete')
  @Redirect('/feedback')
  async remove(@Param('id') id: string) {
    await this.feedbackService.remove(Number(id));
    feedbackEvents.next('Отзыв удалён');
    return { url: '/feedback' };
  }
}