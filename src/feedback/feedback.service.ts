import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.feedback.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: number, text: string) {
    return this.prisma.feedback.create({
      data: { userId, text },
    });
  }

  remove(id: number) {
    return this.prisma.feedback.delete({ where: { id } });
  }
}