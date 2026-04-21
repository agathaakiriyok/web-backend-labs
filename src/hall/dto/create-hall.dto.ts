import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHallDto {
  @ApiProperty({ example: 'Главный зал', description: 'Название зала' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 100, description: 'Вместимость зала (человек)', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;
}
