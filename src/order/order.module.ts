import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderApiController } from './order.api.controller';
import { OrderResolver } from './order.resolver';

@Module({
  controllers: [OrderController, OrderApiController],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
