import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { HallModule } from './hall/hall.module';
import { TicketModule } from './ticket/ticket.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [UserModule, ExhibitionModule, HallModule, TicketModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
