import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { CreateHallInput } from '../graphql/inputs/create-hall.input';
import { UpdateHallInput } from '../graphql/inputs/update-hall.input';
import { PaginationArgs } from '../graphql/pagination.args';
import { ExhibitionType } from '../graphql/types/exhibition.type';
import { HallType } from '../graphql/types/hall.type';
import { HallService } from './hall.service';

@Resolver(() => HallType)
export class HallResolver {
  constructor(
    private readonly hallService: HallService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [HallType], { description: 'Получить список всех залов', complexity: 2 })
  async halls(@Args() { page, limit }: PaginationArgs): Promise<HallType[]> {
    const all = await this.hallService.findAll();
    return all.slice((page - 1) * limit, page * limit) as HallType[];
  }

  @Query(() => HallType, { nullable: true, description: 'Получить зал по идентификатору', complexity: 1 })
  async hall(@Args('id', { type: () => Int }) id: number): Promise<HallType | null> {
    return this.hallService.findOne(id) as Promise<HallType | null>;
  }

  @Mutation(() => HallType, { description: 'Создать новый зал' })
  async createHall(@Args('input') input: CreateHallInput): Promise<HallType> {
    return this.hallService.create(input) as Promise<HallType>;
  }

  @Mutation(() => HallType, { description: 'Обновить зал' })
  async updateHall(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateHallInput,
  ): Promise<HallType> {
    return this.hallService.update(id, input) as Promise<HallType>;
  }

  @Mutation(() => Boolean, { description: 'Удалить зал' })
  async deleteHall(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.hallService.remove(id);
    return true;
  }

  @ResolveField(() => [ExhibitionType], { description: 'Выставки в данном зале', complexity: 3 })
  async exhibitions(
    @Parent() hall: HallType,
    @Args() { page, limit }: PaginationArgs,
  ): Promise<ExhibitionType[]> {
    const all = await this.prisma.exhibition.findMany({ where: { hallId: hall.id } });
    return all.slice((page - 1) * limit, page * limit) as ExhibitionType[];
  }
}
