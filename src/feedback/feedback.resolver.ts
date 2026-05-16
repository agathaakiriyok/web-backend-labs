import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { CreateFeedbackInput } from '../graphql/inputs/create-feedback.input';
import { UpdateFeedbackInput } from '../graphql/inputs/update-feedback.input';
import { PaginationArgs } from '../graphql/pagination.args';
import { FeedbackType } from '../graphql/types/feedback.type';
import { UserType } from '../graphql/types/user.type';
import { FeedbackService } from './feedback.service';

@Resolver(() => FeedbackType)
export class FeedbackResolver {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [FeedbackType], { description: 'Получить список всех отзывов', complexity: 2 })
  async feedbacks(@Args() { page, limit }: PaginationArgs): Promise<FeedbackType[]> {
    const all = await this.feedbackService.findAll();
    return all.slice((page - 1) * limit, page * limit) as unknown as FeedbackType[];
  }

  @Query(() => FeedbackType, { nullable: true, description: 'Получить отзыв по идентификатору', complexity: 1 })
  async feedback(@Args('id', { type: () => Int }) id: number): Promise<FeedbackType | null> {
    return this.feedbackService.findOne(id) as unknown as FeedbackType | null;
  }

  @Mutation(() => FeedbackType, { description: 'Оставить отзыв' })
  async createFeedback(@Args('input') input: CreateFeedbackInput): Promise<FeedbackType> {
    return this.feedbackService.create(input.userId, input.text) as unknown as FeedbackType;
  }

  @Mutation(() => FeedbackType, { description: 'Обновить текст отзыва' })
  async updateFeedback(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateFeedbackInput,
  ): Promise<FeedbackType> {
    return this.feedbackService.update(id, input.text) as unknown as FeedbackType;
  }

  @Mutation(() => Boolean, { description: 'Удалить отзыв' })
  async deleteFeedback(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.feedbackService.remove(id);
    return true;
  }

  @ResolveField(() => UserType, { nullable: true, description: 'Автор отзыва', complexity: 2 })
  async user(@Parent() feedback: FeedbackType): Promise<UserType | null> {
    return this.prisma.user.findUnique({ where: { id: feedback.userId } }) as Promise<UserType | null>;
  }
}
