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
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Render('orders/index')
  async findAll(@Req() req: Request) {
    const s = (req as any).session;
    const orders = await this.orderService.findByUser(s.userId);

    return {
      orders,
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Get(':id')
  @Render('orders/show')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const s = (req as any).session;
    const order = await this.orderService.findOne(Number(id));

    return {
      order,
      isAuth: !!s?.userId,
      username: s?.username,
    };
  }

  @Post()
  @Redirect('/orders')
  async create(@Body() body: any, @Req() req: Request) {
    const s = (req as any).session;

    await this.orderService.create(
      s.userId,
      Number(body.exhibitionId),
      body.type,
      Number(body.price),
    );

    return { url: '/orders' };
  }

  @Post(':id/cancel')
  @Redirect('/orders')
  async cancel(@Param('id') id: string) {
    await this.orderService.updateStatus(Number(id), 'CANCELLED');
    return { url: '/orders' };
  }

  @Post(':id/delete')
  @Redirect('/orders')
  async remove(@Param('id') id: string) {
    await this.orderService.remove(Number(id));
    return { url: '/orders' };
  }
}