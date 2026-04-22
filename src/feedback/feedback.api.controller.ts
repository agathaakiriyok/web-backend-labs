import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException,
  Param, ParseIntPipe, Patch, Post, Query, Req, Res, UseGuards,
} from '@nestjs/common';
import {
  ApiBody, ApiCookieAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
  ApiParam, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { PaginationDto, buildLinkHeader } from '../common/dto/pagination.dto';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackResponseDto } from './dto/feedback-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CacheControl } from '../common/decorators/cache-control.decorator';

@ApiTags('feedback')
@Controller('api/feedback')
export class FeedbackApiController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @CacheControl('public, max-age=300, stale-while-revalidate=60')
  @ApiOperation({ summary: 'Получить все отзывы (с пагинацией)' })
  @ApiOkResponse({ type: [FeedbackResponseDto], description: 'Список отзывов' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const all = await this.feedbackService.findAll();
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', total);
    res.setHeader('Link', buildLinkHeader(req, page, limit, total, 3001));
    return data;
  }

  @Get(':id')
  @CacheControl('public, max-age=300, stale-while-revalidate=60')
  @ApiOperation({ summary: 'Получить отзыв по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: FeedbackResponseDto, description: 'Отзыв найден' })
  @ApiNotFoundResponse({ description: 'Отзыв не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const feedback = await this.feedbackService.findOne(id);
    if (!feedback) throw new NotFoundException(`Отзыв #${id} не найден`);
    return feedback;
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Создать отзыв' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({ status: 201, type: FeedbackResponseDto, description: 'Отзыв создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  async create(@Body() dto: CreateFeedbackDto, @Req() req: Request) {
    const s = (req as any).session;
    const userId: number = s?.userId ?? 1;
    return this.feedbackService.create(userId, dto.text);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Обновить отзыв' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateFeedbackDto })
  @ApiOkResponse({ type: FeedbackResponseDto, description: 'Обновлённый отзыв' })
  @ApiNotFoundResponse({ description: 'Отзыв не найден' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFeedbackDto) {
    const feedback = await this.feedbackService.findOne(id);
    if (!feedback) throw new NotFoundException(`Отзыв #${id} не найден`);
    return this.feedbackService.update(id, dto.text ?? feedback.text);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Отзыв удалён' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiNotFoundResponse({ description: 'Отзыв не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const feedback = await this.feedbackService.findOne(id);
    if (!feedback) throw new NotFoundException(`Отзыв #${id} не найден`);
    await this.feedbackService.remove(id);
  }
}
