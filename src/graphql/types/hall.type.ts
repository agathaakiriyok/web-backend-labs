import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HallType {
  @Field(() => Int, { description: 'Идентификатор зала' })
  id: number;

  @Field({ description: 'Название зала' })
  name: string;

  @Field(() => Int, { description: 'Вместимость зала (количество посетителей)' })
  capacity: number;
}
