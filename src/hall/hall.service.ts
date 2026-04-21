import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HallService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.hall.findMany();
  }

  findOne(id: number) {
    return this.prisma.hall.findUnique({ where: { id } });
  }

  findExhibitions(hallId: number) {
    return this.prisma.exhibition.findMany({ where: { hallId } });
  }

  create(data: { name: string; capacity: number }) {
    return this.prisma.hall.create({
      data: { name: data.name, capacity: Number(data.capacity) },
    });
  }

  update(id: number, data: { name?: string; capacity?: number }) {
    return this.prisma.hall.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.capacity !== undefined && { capacity: Number(data.capacity) }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.hall.delete({ where: { id } });
  }
}
