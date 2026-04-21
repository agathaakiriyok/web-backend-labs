import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ example: 1, description: 'ID позиции заказа' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID заказа' })
  orderId: number;

  @ApiProperty({ example: 3, description: 'ID выставки' })
  exhibitionId: number;

  @ApiProperty({ example: 2, description: 'ID зала' })
  hallId: number;

  @ApiProperty({ example: 2, description: 'Количество билетов' })
  quantity: number;

  @ApiProperty({ example: '500.00', description: 'Цена за единицу (₽)' })
  unitPrice: string;
}
