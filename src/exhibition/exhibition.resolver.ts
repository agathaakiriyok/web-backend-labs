import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { CreateExhibitionInput } from '../graphql/inputs/create-exhibition.input';
import { UpdateExhibitionInput } from '../graphql/inputs/update-exhibition.input';
import { PaginationArgs } from '../graphql/pagination.args';
import { ExhibitionType } from '../graphql/types/exhibition.type';
import { HallType } from '../graphql/types/hall.type';
import { ExhibitionService } from './exhibition.service';

@Resolver(() => ExhibitionType)
export class ExhibitionResolver {
  constructor(
    private readonly exhibitionService: ExhibitionService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [ExhibitionType], { description: 'Получить список всех выставок', complexity: 2 })
  async exhibitions(@Args() { page, limit }: PaginationArgs): Promise<ExhibitionType[]> {
    const all = await this.exhibitionService.findAll();
    return all.slice((page - 1) * limit, page * limit) as ExhibitionType[];
  }

  @Query(() => ExhibitionType, { nullable: true, description: 'Получить выставку по идентификатору', complexity: 1 })
  async exhibition(@Args('id', { type: () => Int }) id: number): Promise<ExhibitionType | null> {
    return this.exhibitionService.findOne(id) as Promise<ExhibitionType | null>;
  }

  @Mutation(() => ExhibitionType, { description: 'Создать новую выставку' })
  async createExhibition(@Args('input') input: CreateExhibitionInput): Promise<ExhibitionType> {
    return this.exhibitionService.create({
      ...input,
      description: input.description ?? '',
    }) as Promise<ExhibitionType>;
  }

  @Mutation(() => ExhibitionType, { description: 'Обновить данные выставки' })
  async updateExhibition(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateExhibitionInput,
  ): Promise<ExhibitionType> {
    const current = await this.exhibitionService.findOne(id);
    return this.exhibitionService.update(id, {
      name: input.name ?? current!.name,
      description: input.description ?? current!.description ?? '',
      dateStart: input.dateStart ?? current!.dateStart.toISOString(),
      dateEnd: input.dateEnd ?? current!.dateEnd.toISOString(),
      hallId: input.hallId ?? current!.hallId,
    }) as Promise<ExhibitionType>;
  }

  @Mutation(() => Boolean, { description: 'Удалить выставку' })
  async deleteExhibition(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.exhibitionService.remove(id);
    return true;
  }

  @ResolveField(() => HallType, { nullable: true, description: 'Зал, в котором проходит выставка', complexity: 2 })
  async hall(@Parent() exhibition: ExhibitionType): Promise<HallType | null> {
    return this.prisma.hall.findUnique({ where: { id: exhibition.hallId } }) as Promise<HallType | null>;
  }
}
