import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { CreateOrderInput } from '../graphql/inputs/create-order.input';
import { PaginationArgs } from '../graphql/pagination.args';
import { OrderItemType } from '../graphql/types/order-item.type';
import { OrderType } from '../graphql/types/order.type';
import { UserType } from '../graphql/types/user.type';
import { OrderService } from './order.service';

@Resolver(() => OrderType)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [OrderType], { description: 'Получить список всех заказов', complexity: 2 })
  async orders(@Args() { page, limit }: PaginationArgs): Promise<OrderType[]> {
    const all = await this.orderService.findAll();
    return all.slice((page - 1) * limit, page * limit) as unknown as OrderType[];
  }

  @Query(() => OrderType, { nullable: true, description: 'Получить заказ по идентификатору', complexity: 1 })
  async order(@Args('id', { type: () => Int }) id: number): Promise<OrderType | null> {
    return this.orderService.findOne(id) as unknown as OrderType | null;
  }

  @Query(() => [OrderType], { description: 'Получить заказы пользователя', complexity: 2 })
  async ordersByUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args() { page, limit }: PaginationArgs,
  ): Promise<OrderType[]> {
    const all = await this.orderService.findByUser(userId);
    return all.slice((page - 1) * limit, page * limit) as unknown as OrderType[];
  }

  @Mutation(() => OrderType, { description: 'Создать новый заказ (покупка билетов)' })
  async createOrder(@Args('input') input: CreateOrderInput): Promise<OrderType> {
    return this.orderService.create(
      input.userId,
      input.exhibitionId,
      input.quantity,
      input.unitPrice,
    ) as unknown as OrderType;
  }

  @Mutation(() => OrderType, { description: 'Оплатить заказ' })
  async payOrder(@Args('id', { type: () => Int }) id: number): Promise<OrderType> {
    return this.orderService.updateStatus(id, 'PAID') as unknown as OrderType;
  }

  @Mutation(() => OrderType, { description: 'Отменить заказ' })
  async cancelOrder(@Args('id', { type: () => Int }) id: number): Promise<OrderType> {
    return this.orderService.updateStatus(id, 'CANCELLED') as unknown as OrderType;
  }

  @Mutation(() => Boolean, { description: 'Удалить заказ' })
  async deleteOrder(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.orderService.remove(id);
    return true;
  }

  @ResolveField(() => UserType, { nullable: true, description: 'Пользователь, создавший заказ', complexity: 2 })
  async user(@Parent() order: OrderType): Promise<UserType | null> {
    return this.prisma.user.findUnique({ where: { id: order.userId } }) as Promise<UserType | null>;
  }

  @ResolveField(() => [OrderItemType], { description: 'Позиции заказа', complexity: 3 })
  async items(
    @Parent() order: OrderType,
    @Args() { page, limit }: PaginationArgs,
  ): Promise<OrderItemType[]> {
    const all = await this.prisma.orderItem.findMany({ where: { orderId: order.id } });
    return all.slice((page - 1) * limit, page * limit) as unknown as OrderItemType[];
  }
}
