import { ApiExcludeController } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request, Response } from 'express';

@ApiExcludeController()
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Render('tickets')
  async ticketPage(
    @Query('exhibitionId') exhibitionId: string,
    @Query('error') error: string,
    @Req() req: Request,
  ) {
    const s = (req as any).session;
    const userOrders = s?.userId ? await this.orderService.findByUser(s.userId) : [];

    const exhibition = exhibitionId
      ? await this.prisma.exhibition.findUnique({
          where: { id: Number(exhibitionId) },
          include: { hall: true },
        })
      : null;

    return {
      exhibition,
      userOrders,
      error: error === 'not_found' ? 'Выставка не найдена. Пожалуйста, выберите другую выставку.' : null,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: s?.username === 'Агата',
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    const s = (req as any).session;
    const exhibitionId = Number(body.exhibitionId);
    const quantity = Number(body.quantity) || 1;
    const unitPrice = Number(body.unitPrice) || 500;

    if (!exhibitionId) {
      return res.redirect('/exhibitions');
    }

    const exhibition = await this.prisma.exhibition.findUnique({
      where: { id: exhibitionId },
    });

    if (!exhibition) {
      return res.redirect(`/tickets?error=not_found`);
    }

    await this.orderService.create(s.userId, exhibitionId, quantity, unitPrice);
    return res.redirect('/tickets');
  }
}
