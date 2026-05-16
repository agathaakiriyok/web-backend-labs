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

  create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  update(id: number, data: { name: string; email: string }) {
    return this.prisma.user.update({
      where: { id },
      data: { name: data.name, email: data.email },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
