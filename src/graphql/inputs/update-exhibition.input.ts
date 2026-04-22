import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateExhibitionInput {
  @Field({ nullable: true, description: 'Новое название выставки' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @Field({ nullable: true, description: 'Новое описание выставки' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true, description: 'Новая дата начала (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateStart?: string;

  @Field({ nullable: true, description: 'Новая дата окончания (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  @Field(() => Int, { nullable: true, description: 'Новый идентификатор зала' })
  @IsOptional()
  @IsInt()
  hallId?: number;
}
