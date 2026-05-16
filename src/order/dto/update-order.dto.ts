import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderDto {
  @ApiProperty({
    enum: OrderStatusEnum,
    example: OrderStatusEnum.PAID,
    description: 'Новый статус заказа',
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
