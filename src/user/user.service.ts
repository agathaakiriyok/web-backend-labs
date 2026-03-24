import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}