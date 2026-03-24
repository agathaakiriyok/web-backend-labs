import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExhibitionService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.exhibition.findMany({ include: { hall: true } });
  }

  findOne(id: number) {
    return this.prisma.exhibition.findUnique({
      where: { id },
      include: { hall: true },
    });
  }

  create(data: { name: string; description: string; dateStart: string; dateEnd: string; hallId: number }) {
    return this.prisma.exhibition.create({
      data: {
        name: data.name,
        description: data.description,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        hallId: Number(data.hallId),
      },
    });
  }

  update(id: number, data: { name: string; description: string; dateStart: string; dateEnd: string; hallId: number }) {
    return this.prisma.exhibition.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        hallId: Number(data.hallId),
      },
    });
  }

  remove(id: number) {
    return this.prisma.exhibition.delete({ where: { id } });
  }
}