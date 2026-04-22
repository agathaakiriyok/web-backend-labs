import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderApiController } from './order.api.controller';
import { OrderResolver } from './order.resolver';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  controllers: [OrderController, OrderApiController],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(OrderController);
  }
}
