import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(name: string) {
    return this.prisma.user.findFirst({ where: { name } });
  }

  async register(name: string, email: string, password: string) {
    const nameTaken = await this.prisma.user.findFirst({ where: { name } });
    if (nameTaken) return null;

    const emailTaken = await this.prisma.user.findFirst({ where: { email } });
    if (emailTaken) return null;

    return this.prisma.user.create({ data: { name, email, password } });
  }
}
