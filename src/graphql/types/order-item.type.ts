import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItemType {
  @Field(() => Int, { description: 'Идентификатор позиции заказа' })
  id: number;

  @Field(() => Int, { description: 'Идентификатор заказа' })
  orderId: number;

  @Field(() => Int, { description: 'Идентификатор выставки' })
  exhibitionId: number;

  @Field(() => Int, { description: 'Идентификатор зала' })
  hallId: number;

  @Field(() => Int, { description: 'Количество билетов' })
  quantity: number;

  @Field(() => Float, { description: 'Цена за один билет' })
  unitPrice: number;
}
