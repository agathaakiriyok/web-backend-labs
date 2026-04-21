import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHallDto {
  @ApiPropertyOptional({ example: 'Главный зал', description: 'Новое название зала' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 150, description: 'Новая вместимость', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;
}
