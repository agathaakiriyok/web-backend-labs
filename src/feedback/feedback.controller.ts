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
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @Render('feedback')
  async findAll(@Req() req: Request) {
    const s = (req as any).session;
    const feedbacks = await this.feedbackService.findAll();

    return {
      feedbacks,
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Redirect('/feedback')
  async create(@Body() body: any, @Req() req: Request) {
    const s = (req as any).session;

    await this.feedbackService.create(s.userId, body.text);

    return { url: '/feedback' };
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  @Redirect('/feedback')
  async remove(@Param('id') id: string) {
    await this.feedbackService.remove(Number(id));
    return { url: '/feedback' };
  }
}