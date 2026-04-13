import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { HallModule } from './hall/hall.module';
import { OrderModule } from './order/order.module';
import { FeedbackModule } from './feedback/feedback.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ExhibitionModule,
    HallModule,
    OrderModule,
    FeedbackModule,
    TicketModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
