import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ExhibitionController } from './exhibition.controller';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionApiController } from './exhibition.api.controller';
import { ExhibitionResolver } from './exhibition.resolver';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  controllers: [ExhibitionController, ExhibitionApiController],
  providers: [ExhibitionService, ExhibitionResolver],
})
export class ExhibitionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'exhibitions/add', method: RequestMethod.GET },
        { path: 'exhibitions', method: RequestMethod.POST },
        { path: 'exhibitions/:id/update', method: RequestMethod.POST },
        { path: 'exhibitions/:id/delete', method: RequestMethod.POST },
      );
  }
}
