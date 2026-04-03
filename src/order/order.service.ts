import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        tickets: {
          include: { exhibition: true },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        tickets: {
          include: { exhibition: true },
        },
        payments: true,
        user: true,
      },
    });
  }

  async create(userId: number, exhibitionId: number, type: string, price: number) {
    return this.prisma.order.create({
      data: {
        userId,
        totalAmount: price,
        status: 'PENDING',
        tickets: {
          create: {
            type,
            price,
            exhibitionId,
          },
        },
      },
      include: { tickets: true },
    });
  }

  async updateStatus(id: number, status: 'PENDING' | 'PAID' | 'CANCELLED') {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}