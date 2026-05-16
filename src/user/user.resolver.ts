import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '../graphql/pagination.args';
import { FeedbackType } from '../graphql/types/feedback.type';
import { OrderType } from '../graphql/types/order.type';
import { UserType } from '../graphql/types/user.type';
import { UserService } from './user.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType], { description: 'Получить список всех пользователей', complexity: 2 })
  async users(@Args() { page, limit }: PaginationArgs): Promise<UserType[]> {
    const all = await this.userService.findAll();
    return all.slice((page - 1) * limit, page * limit) as UserType[];
  }

  @Query(() => UserType, { nullable: true, description: 'Получить пользователя по идентификатору', complexity: 1 })
  async user(@Args('id', { type: () => Int }) id: number): Promise<UserType | null> {
    return this.userService.findOne(id) as Promise<UserType | null>;
  }

  @ResolveField(() => [FeedbackType], { description: 'Отзывы пользователя', complexity: 3 })
  async feedbacks(
    @Parent() user: UserType,
    @Args() { page, limit }: PaginationArgs,
  ): Promise<FeedbackType[]> {
    const all = await this.userService.findFeedbacks(user.id);
    return all.slice((page - 1) * limit, page * limit) as unknown as FeedbackType[];
  }

  @ResolveField(() => [OrderType], { description: 'Заказы пользователя', complexity: 3 })
  async orders(
    @Parent() user: UserType,
    @Args() { page, limit }: PaginationArgs,
  ): Promise<OrderType[]> {
    const all = await this.userService.findOrders(user.id);
    return all.slice((page - 1) * limit, page * limit) as unknown as OrderType[];
  }
}
