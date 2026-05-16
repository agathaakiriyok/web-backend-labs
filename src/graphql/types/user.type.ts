import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int, { description: 'Идентификатор пользователя' })
  id: number;

  @Field({ description: 'Имя пользователя' })
  name: string;

  @Field({ description: 'Email пользователя' })
  email: string;

  @Field({ description: 'Дата регистрации' })
  createdAt: Date;
}
