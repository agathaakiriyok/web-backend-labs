import {
  Controller,
  Get,
  Param,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get(':id')
  @Render('tickets/show')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const s = (req as any).session;
    const ticket = await this.ticketService.findOne(Number(id));

    return {
      ticket,
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }
}