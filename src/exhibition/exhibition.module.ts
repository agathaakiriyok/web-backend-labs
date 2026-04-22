import { Module } from '@nestjs/common';
import { ExhibitionController } from './exhibition.controller';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionApiController } from './exhibition.api.controller';
import { ExhibitionResolver } from './exhibition.resolver';

@Module({
  controllers: [ExhibitionController, ExhibitionApiController],
  providers: [ExhibitionService, ExhibitionResolver],
})
export class ExhibitionModule {}
