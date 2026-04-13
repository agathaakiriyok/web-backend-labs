import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { exhibition: true, hall: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { exhibition: true, hall: true },
        },
        user: true,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { exhibition: true, hall: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: number, exhibitionId: number, quantity: number, unitPrice: number) {
    const exhibition = await this.prisma.exhibition.findUnique({ where: { id: exhibitionId } });
    if (!exhibition) throw new Error('Exhibition not found');

    const totalPrice = quantity * unitPrice;

    return this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: 'PENDING',
        items: {
          create: {
            exhibitionId,
            hallId: exhibition.hallId,
            quantity,
            unitPrice,
          },
        },
      },
      include: { items: true },
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