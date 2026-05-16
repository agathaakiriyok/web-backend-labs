import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackApiController } from './feedback.api.controller';
import { FeedbackResolver } from './feedback.resolver';

@Module({
  controllers: [FeedbackController, FeedbackApiController],
  providers: [FeedbackService, FeedbackResolver],
})
export class FeedbackModule {}
