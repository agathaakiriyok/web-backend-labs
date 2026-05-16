import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID выставки' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  exhibitionId: number;

  @ApiProperty({ example: 2, description: 'Количество билетов', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 500, description: 'Цена за единицу (₽)', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
