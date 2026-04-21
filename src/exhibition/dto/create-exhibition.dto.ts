import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateExhibitionDto {
  @ApiProperty({ example: 'Искусство портрета', description: 'Название выставки' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Описание выставки', description: 'Описание (необязательно)', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-01-01', description: 'Дата начала (ISO 8601)' })
  @IsDateString()
  dateStart: string;

  @ApiProperty({ example: '2026-06-01', description: 'Дата окончания (ISO 8601)' })
  @IsDateString()
  dateEnd: string;

  @ApiProperty({ example: 1, description: 'ID зала', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  hallId: number;
}
