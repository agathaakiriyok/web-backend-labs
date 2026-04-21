import { Module } from '@nestjs/common';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { HallApiController } from './hall.api.controller';

@Module({
  controllers: [HallController, HallApiController],
  providers: [HallService],
})
export class HallModule {}
