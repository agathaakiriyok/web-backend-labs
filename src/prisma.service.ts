import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to the database successfully.');
    } catch (error) {
      this.logger.error(
        'Database connection failed. Verify DATABASE_URL in .env and ensure the database server is reachable.',
        error as Error,
      );
      throw error;
    }
  }
}