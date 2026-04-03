import {
  Controller,
  Post,
  Body,
  Param,
  Redirect,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':orderId/pay')
  @Redirect('/orders')
  async pay(
    @Param('orderId') orderId: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const s = (req as any).session;

    await this.paymentService.pay(
      Number(orderId),
      Number(body.amount),
      s?.userId,
    );

    return { url: '/orders' };
  }
}