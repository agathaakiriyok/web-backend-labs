import { Module } from '@nestjs/common';
import { ExhibitionController } from './exhibition.controller';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionApiController } from './exhibition.api.controller';

@Module({
  controllers: [ExhibitionController, ExhibitionApiController],
  providers: [ExhibitionService],
})
export class ExhibitionModule {}
