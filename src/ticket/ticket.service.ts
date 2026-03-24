import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.ticket.findMany({ include: { user: true, exhibition: true } });
  }

  create(data: { type: string; price: number; userId: number; exhibitionId: number }) {
    return this.prisma.ticket.create({
      data: {
        type: data.type,
        price: Number(data.price),
        userId: Number(data.userId),
        exhibitionId: Number(data.exhibitionId),
      },
    });
  }

  remove(id: number) {
    return this.prisma.ticket.delete({ where: { id } });
  }
}