import { Module } from '@nestjs/common';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { HallApiController } from './hall.api.controller';
import { HallResolver } from './hall.resolver';

@Module({
  controllers: [HallController, HallApiController],
  providers: [HallService, HallResolver],
})
export class HallModule {}
