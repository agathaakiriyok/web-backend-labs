import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  findByOrder(orderId: number) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async pay(orderId: number, amount: number, userId: number) {
    // проверка владельца заказа
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new ForbiddenException('Нет доступа к заказу');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount,
        status: 'SUCCESS',
      },
    });

    await this.orderService.updateStatus(orderId, 'PAID');

    return payment;
  }
}