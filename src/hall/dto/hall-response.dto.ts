import { ApiProperty } from '@nestjs/swagger';

export class HallResponseDto {
  @ApiProperty({ example: 1, description: 'ID зала' })
  id: number;

  @ApiProperty({ example: 'Египетский зал', description: 'Название зала' })
  name: string;

  @ApiProperty({ example: 150, description: 'Вместимость зала (человек)' })
  capacity: number;
}
