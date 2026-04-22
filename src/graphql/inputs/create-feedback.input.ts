import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateFeedbackInput {
  @Field(() => Int, { description: 'Идентификатор пользователя' })
  @IsInt()
  userId: number;

  @Field({ description: 'Текст отзыва' })
  @IsString()
  @MinLength(1)
  text: string;
}
