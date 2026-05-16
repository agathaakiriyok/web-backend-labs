import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(name: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { name } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return user;
  }

  async register(name: string, email: string, password: string) {
    const nameTaken = await this.prisma.user.findFirst({ where: { name } });
    if (nameTaken) return null;

    const emailTaken = await this.prisma.user.findFirst({ where: { email } });
    if (emailTaken) return null;

    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({ data: { name, email, password: hashed } });
  }
}
