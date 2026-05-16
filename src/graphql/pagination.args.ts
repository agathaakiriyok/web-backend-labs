import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1, description: 'Номер страницы' })
  @Min(1)
  page: number = 1;

  @Field(() => Int, { defaultValue: 10, description: 'Количество элементов на странице' })
  @Min(1)
  limit: number = 10;
}
