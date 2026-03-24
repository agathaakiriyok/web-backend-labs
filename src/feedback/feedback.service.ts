import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.feedback.findMany({ include: { user: true } });
  }

  create(data: { text: string; userId: number }) {
    return this.prisma.feedback.create({
      data: { text: data.text, userId: Number(data.userId) },
    });
  }

  remove(id: number) {
    return this.prisma.feedback.delete({ where: { id } });
  }
}