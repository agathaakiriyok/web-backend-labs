import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class CreateHallInput {
  @Field({ description: 'Название зала' })
  @IsString()
  @MinLength(1)
  name: string;

  @Field(() => Int, { description: 'Вместимость зала' })
  @IsInt()
  @Min(1)
  capacity: number;
}
