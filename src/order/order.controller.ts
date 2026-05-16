import { ApiExcludeController } from '@nestjs/swagger';
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
  ForbiddenException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@ApiExcludeController()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Render('orders/index')
  async findAll(@Req() req: Request) {
    const s = (req as any).session;
    const isAdmin = s?.username === 'Агата';
    const orders = isAdmin
      ? await this.orderService.findAll()
      : await this.orderService.findByUser(s.userId);

    return {
      orders,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin,
    };
  }

  @Get(':id')
  @Render('orders/show')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const s = (req as any).session;
    const isAdmin = s?.username === 'Агата';
    const order = await this.orderService.findOne(Number(id));

    if (!order || (!isAdmin && order.userId !== s.userId)) {
      throw new ForbiddenException('Нет доступа к заказу');
    }

    return {
      order,
      isAuth: !!s?.userId,
      username: s?.username,
      isAdmin,
    };
  }

  @Post()
  @Redirect('/orders')
  async create(@Body() body: any, @Req() req: Request) {
    const s = (req as any).session;

    await this.orderService.create(
      s.userId,
      Number(body.exhibitionId),
      Number(body.quantity) || 1,
      Number(body.unitPrice),
    );

    return { url: '/orders' };
  }

  @Post(':id/cancel')
  @Redirect('/orders')
  async cancel(@Param('id') id: string, @Req() req: Request) {
    const s = (req as any).session;
    const isAdmin = s?.username === 'Агата';
    const order = await this.orderService.findOne(Number(id));

    if (!order || (!isAdmin && order.userId !== s.userId)) {
      throw new ForbiddenException('Нет доступа к заказу');
    }

    await this.orderService.updateStatus(Number(id), 'CANCELLED');
    return { url: '/orders' };
  }

  @Post(':id/delete')
  @Redirect('/orders')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const s = (req as any).session;
    const isAdmin = s?.username === 'Агата';
    const order = await this.orderService.findOne(Number(id));

    if (!order || (!isAdmin && order.userId !== s.userId)) {
      throw new ForbiddenException('Нет доступа к заказу');
    }

    await this.orderService.remove(Number(id));
    return { url: '/orders' };
  }
}