import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeedbackType {
  @Field(() => Int, { description: 'Идентификатор отзыва' })
  id: number;

  @Field({ description: 'Текст отзыва' })
  text: string;

  @Field({ description: 'Дата создания отзыва' })
  createdAt: Date;

  @Field(() => Int, { description: 'Идентификатор автора отзыва' })
  userId: number;
}
