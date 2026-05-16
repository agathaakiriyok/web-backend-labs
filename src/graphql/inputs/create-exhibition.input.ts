import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateExhibitionInput {
  @Field({ description: 'Название выставки' })
  @IsString()
  @MinLength(1)
  name: string;

  @Field({ nullable: true, description: 'Описание выставки' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ description: 'Дата начала (ISO 8601, например 2026-06-01)' })
  @IsDateString()
  dateStart: string;

  @Field({ description: 'Дата окончания (ISO 8601, например 2026-09-01)' })
  @IsDateString()
  dateEnd: string;

  @Field(() => Int, { description: 'Идентификатор зала' })
  @IsInt()
  hallId: number;
}
