import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateExhibitionDto {
  @ApiPropertyOptional({ example: 'Искусство портрета' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Новое описание' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Дата начала (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateStart?: string;

  @ApiPropertyOptional({ example: '2026-06-01', description: 'Дата окончания (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  @ApiPropertyOptional({ example: 2, description: 'ID зала', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  hallId?: number;
}
