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
import { OrderService } from './order.service';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderItemResponseDto } from './dto/order-item-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('orders')
@Controller('api/orders')
export class OrderApiController {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все заказы (с пагинацией)' })
  @ApiOkResponse({ type: [OrderResponseDto], description: 'Список заказов' })
  async findAll(@Query() pagination: PaginationDto, @Req() req: Request, @Res() res: Response) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const all = await this.orderService.findAll();
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', total);
    res.setHeader('Link', buildLinkHeader(req, page, limit, total, 3001));
    return res.json(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: OrderResponseDto, description: 'Заказ найден' })
  @ApiNotFoundResponse({ description: 'Заказ не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    if (!order) throw new NotFoundException(`Заказ #${id} не найден`);
    return order;
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Получить позиции заказа' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: [OrderItemResponseDto], description: 'Список позиций заказа' })
  @ApiNotFoundResponse({ description: 'Заказ не найден' })
  async findItems(@Param('id', ParseIntPipe) id: number, @Query() pagination: PaginationDto, @Req() req: Request, @Res() res: Response) {
    const order = await this.orderService.findOne(id);
    if (!order) throw new NotFoundException(`Заказ #${id} не найден`);
    const all = await this.prisma.orderItem.findMany({
      where: { orderId: id },
      include: { exhibition: true, hall: true },
    });
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', all.length);
    res.setHeader('Link', buildLinkHeader(req, page, limit, all.length, 3001));
    return res.json(data);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Создать заказ (купить билет)' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, type: OrderResponseDto, description: 'Заказ создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Выставка не найдена' })
  async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const info = (req as any).authInfo ?? {};
    const exhibition = await this.prisma.exhibition.findUnique({ where: { id: dto.exhibitionId } });
    if (!exhibition) throw new NotFoundException(`Выставка #${dto.exhibitionId} не найдена`);
    return this.orderService.create(info.userId, dto.exhibitionId, dto.quantity, dto.unitPrice);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Обновить статус заказа' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({ type: OrderResponseDto, description: 'Обновлённый заказ' })
  @ApiNotFoundResponse({ description: 'Заказ не найден' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    const order = await this.orderService.findOne(id);
    if (!order) throw new NotFoundException(`Заказ #${id} не найден`);
    return this.orderService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Удалить заказ' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Заказ удалён' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiNotFoundResponse({ description: 'Заказ не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    if (!order) throw new NotFoundException(`Заказ #${id} не найден`);
    await this.orderService.remove(id);
  }
}
