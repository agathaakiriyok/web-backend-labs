import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackApiController } from './feedback.api.controller';

@Module({
  controllers: [FeedbackController, FeedbackApiController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
