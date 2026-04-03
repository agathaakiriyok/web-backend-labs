import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { HallModule } from './hall/hall.module';
import { OrderModule } from './order/order.module';
import { TicketModule } from './ticket/ticket.module';
import { PaymentModule } from './payment/payment.module';
import { FeedbackModule } from './feedback/feedback.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ExhibitionModule,
    HallModule,
    OrderModule,
    TicketModule,
    PaymentModule,
    FeedbackModule,
    UserModule,
  ],
})
export class AppModule {}