import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from './update-order.dto';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty({ example: 1, description: 'ID заказа' })
  id: number;

  @ApiProperty({ example: 4, description: 'ID пользователя' })
  userId: number;

  @ApiProperty({ enum: OrderStatusEnum, example: OrderStatusEnum.PENDING, description: 'Статус заказа' })
  status: OrderStatusEnum;

  @ApiProperty({ example: '1000.00', description: 'Итоговая сумма заказа (₽)' })
  totalPrice: string;

  @ApiProperty({ example: '2026-04-22T12:00:00.000Z', description: 'Дата создания заказа' })
  createdAt: Date;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Позиции заказа' })
  items: OrderItemResponseDto[];
}
