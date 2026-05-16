import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExhibitionType {
  @Field(() => Int, { description: 'Идентификатор выставки' })
  id: number;

  @Field({ description: 'Название выставки' })
  name: string;

  @Field({ nullable: true, description: 'Описание выставки' })
  description?: string;

  @Field({ description: 'Дата начала выставки' })
  dateStart: Date;

  @Field({ description: 'Дата окончания выставки' })
  dateEnd: Date;

  @Field(() => Int, { description: 'Идентификатор зала' })
  hallId: number;

  @Field({ nullable: true, description: 'Путь к изображению выставки' })
  image?: string;
}
