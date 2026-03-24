import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { FeedbackModule } from './feedback/feedback.module';
import { TicketModule } from './ticket/ticket.module';
import { HallModule } from './hall/hall.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ExhibitionModule, FeedbackModule, TicketModule, HallModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}