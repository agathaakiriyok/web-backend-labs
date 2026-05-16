import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => Int, { description: 'Идентификатор пользователя' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'Идентификатор выставки' })
  @IsInt()
  exhibitionId: number;

  @Field(() => Int, { defaultValue: 1, description: 'Количество билетов' })
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Float, { description: 'Цена за один билет' })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}
