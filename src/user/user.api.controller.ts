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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FeedbackResponseDto } from '../feedback/dto/feedback-response.dto';
import { OrderResponseDto } from '../order/dto/order-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CacheControl } from '../common/decorators/cache-control.decorator';

@ApiTags('users')
@Controller('api/users')
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheControl('private, max-age=60')
  @ApiOperation({ summary: 'Получить всех пользователей (с пагинацией)' })
  @ApiOkResponse({ type: [UserResponseDto], description: 'Список пользователей' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const all = await this.userService.findAll();
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', total);
    res.setHeader('Link', buildLinkHeader(req, page, limit, total, 3001));
    return data;
  }

  @Get(':id')
  @CacheControl('private, max-age=60')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: UserResponseDto, description: 'Пользователь найден' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`Пользователь #${id} не найден`);
    return user;
  }

  @Get(':id/feedbacks')
  @CacheControl('private, max-age=60')
  @ApiOperation({ summary: 'Получить все отзывы пользователя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: [FeedbackResponseDto], description: 'Список отзывов пользователя' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async findFeedbacks(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`Пользователь #${id} не найден`);
    const all = await this.userService.findFeedbacks(id);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', all.length);
    res.setHeader('Link', buildLinkHeader(req, page, limit, all.length, 3001));
    return data;
  }

  @Get(':id/orders')
  @CacheControl('private, max-age=60')
  @ApiOperation({ summary: 'Получить все заказы пользователя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: [OrderResponseDto], description: 'Список заказов пользователя' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async findOrders(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`Пользователь #${id} не найден`);
    const all = await this.userService.findOrders(id);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', all.length);
    res.setHeader('Link', buildLinkHeader(req, page, limit, all.length, 3001));
    return data;
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserResponseDto, description: 'Пользователь создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 409, description: 'Пользователь с таким email уже существует' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto, description: 'Обновлённый пользователь' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`Пользователь #${id} не найден`);
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Пользователь удалён' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`Пользователь #${id} не найден`);
    await this.userService.remove(id);
  }
}
