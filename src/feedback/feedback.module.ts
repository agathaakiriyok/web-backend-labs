import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackApiController } from './feedback.api.controller';
import { FeedbackResolver } from './feedback.resolver';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  controllers: [FeedbackController, FeedbackApiController],
  providers: [FeedbackService, FeedbackResolver],
})
export class FeedbackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'feedback', method: RequestMethod.POST },
        { path: 'feedback/:id/update', method: RequestMethod.POST },
        { path: 'feedback/:id/delete', method: RequestMethod.POST },
      );
  }
}
