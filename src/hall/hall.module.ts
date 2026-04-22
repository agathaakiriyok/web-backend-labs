import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { HallApiController } from './hall.api.controller';
import { HallResolver } from './hall.resolver';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  controllers: [HallController, HallApiController],
  providers: [HallService, HallResolver],
})
export class HallModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'halls/add', method: RequestMethod.GET },
        { path: 'halls', method: RequestMethod.POST },
        { path: 'halls/:id/update', method: RequestMethod.POST },
        { path: 'halls/:id/delete', method: RequestMethod.POST },
      );
  }
}
