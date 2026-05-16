import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateFeedbackInput {
  @Field({ description: 'Новый текст отзыва' })
  @IsString()
  @MinLength(1)
  text: string;
}
