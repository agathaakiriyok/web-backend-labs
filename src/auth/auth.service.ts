import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(name: string) {
    let user = await this.prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase()}@example.com`,
          password: 'password', 
        },
      });
    }

    return user;
  }
}