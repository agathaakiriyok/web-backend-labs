import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateHallInput {
  @Field({ nullable: true, description: 'Новое название зала' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @Field(() => Int, { nullable: true, description: 'Новая вместимость зала' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
