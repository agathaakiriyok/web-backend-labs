import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Статус заказа',
  valuesMap: {
    PENDING: { description: 'Ожидает оплаты' },
    PAID: { description: 'Оплачен' },
    CANCELLED: { description: 'Отменён' },
  },
});

@ObjectType()
export class OrderType {
  @Field(() => Int, { description: 'Идентификатор заказа' })
  id: number;

  @Field(() => Int, { description: 'Идентификатор пользователя' })
  userId: number;

  @Field(() => OrderStatus, { description: 'Статус заказа' })
  status: OrderStatus;

  @Field(() => Float, { description: 'Итоговая сумма заказа' })
  totalPrice: number;

  @Field({ description: 'Дата создания заказа' })
  createdAt: Date;
}
