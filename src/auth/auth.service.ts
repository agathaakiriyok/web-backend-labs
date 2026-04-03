import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }
}