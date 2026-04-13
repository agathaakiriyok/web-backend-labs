import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Render,
  Req,
  Redirect,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('tickets')
export class TicketController {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Render('tickets')
  async ticketPage(@Query('exhibitionId') exhibitionId: string, @Req() req: Request) {
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
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin: s?.username === 'Агата',
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Redirect('/orders')
  async createOrder(@Body() body: any, @Req() req: Request) {
    const s = (req as any).session;
    const exhibitionId = Number(body.exhibitionId);
    const quantity = Number(body.quantity) || 1;
    const unitPrice = Number(body.unitPrice);

    if (!exhibitionId || !unitPrice) {
      throw new ForbiddenException('Неверные данные заказа');
    }

    await this.orderService.create(s.userId, exhibitionId, quantity, unitPrice);
    return { url: '/orders' };
  }
}
