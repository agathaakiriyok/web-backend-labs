import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [TicketController],
})
export class TicketModule {}
