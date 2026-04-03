import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.ticket.findMany({
      where: {
        order: { userId },
      },
      include: {
        exhibition: true,
        order: true,
      },
    });
  }

  findAll() {
    return this.prisma.ticket.findMany({
      include: { exhibition: true, order: { include: { user: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { exhibition: true, order: true },
    });
  }
}