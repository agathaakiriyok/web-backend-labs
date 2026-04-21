import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderApiController } from './order.api.controller';

@Module({
  controllers: [OrderController, OrderApiController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
