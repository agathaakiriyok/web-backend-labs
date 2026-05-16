import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExhibitionResponseDto {
  @ApiProperty({ example: 1, description: 'ID выставки' })
  id: number;

  @ApiProperty({ example: 'Искусство портрета', description: 'Название выставки' })
  name: string;

  @ApiPropertyOptional({ example: 'Коллекция портретов XVIII века', description: 'Описание выставки' })
  description: string | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Дата начала' })
  dateStart: Date;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z', description: 'Дата окончания' })
  dateEnd: Date;

  @ApiProperty({ example: 2, description: 'ID зала проведения' })
  hallId: number;
}
