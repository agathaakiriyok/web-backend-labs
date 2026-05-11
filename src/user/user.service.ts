import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findFeedbacks(userId: number) {
    return this.prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { exhibition: true, hall: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: { name: string; email: string }) {
    return this.prisma.user.create({ data });
  }

  update(id: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
