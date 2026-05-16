import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException,
  Param, ParseIntPipe, Patch, Post, Query, Req, Res,
} from '@nestjs/common';
import {
  ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
  ApiParam, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { PaginationDto, buildLinkHeader } from '../common/dto/pagination.dto';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { HallResponseDto } from './dto/hall-response.dto';
import { ExhibitionResponseDto } from '../exhibition/dto/exhibition-response.dto';

@ApiTags('halls')
@Controller('api/halls')
export class HallApiController {
  constructor(private readonly hallService: HallService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все залы (с пагинацией)' })
  @ApiOkResponse({ type: [HallResponseDto], description: 'Список залов' })
  async findAll(@Query() pagination: PaginationDto, @Req() req: Request, @Res() res: Response) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const all = await this.hallService.findAll();
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', total);
    res.setHeader('Link', buildLinkHeader(req, page, limit, total, 3001));
    return res.json(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить зал по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: HallResponseDto, description: 'Зал найден' })
  @ApiNotFoundResponse({ description: 'Зал не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const hall = await this.hallService.findOne(id);
    if (!hall) throw new NotFoundException(`Зал #${id} не найден`);
    return hall;
  }

  @Get(':id/exhibitions')
  @ApiOperation({ summary: 'Получить все выставки в зале' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: [ExhibitionResponseDto], description: 'Список выставок зала' })
  @ApiNotFoundResponse({ description: 'Зал не найден' })
  async findExhibitions(@Param('id', ParseIntPipe) id: number, @Query() pagination: PaginationDto, @Req() req: Request, @Res() res: Response) {
    const hall = await this.hallService.findOne(id);
    if (!hall) throw new NotFoundException(`Зал #${id} не найден`);
    const all = await this.hallService.findExhibitions(id);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', all.length);
    res.setHeader('Link', buildLinkHeader(req, page, limit, all.length, 3001));
    return res.json(data);
  }

  @Post()
  @ApiOperation({ summary: 'Создать зал' })
  @ApiBody({ type: CreateHallDto })
  @ApiResponse({ status: 201, type: HallResponseDto, description: 'Зал создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  async create(@Body() dto: CreateHallDto) {
    return this.hallService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить зал' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateHallDto })
  @ApiOkResponse({ type: HallResponseDto, description: 'Обновлённый зал' })
  @ApiNotFoundResponse({ description: 'Зал не найден' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHallDto) {
    const hall = await this.hallService.findOne(id);
    if (!hall) throw new NotFoundException(`Зал #${id} не найден`);
    return this.hallService.update(id, dto as any);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить зал' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Зал удалён' })
  @ApiResponse({ status: 409, description: 'Зал используется выставками' })
  @ApiNotFoundResponse({ description: 'Зал не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const hall = await this.hallService.findOne(id);
    if (!hall) throw new NotFoundException(`Зал #${id} не найден`);
    await this.hallService.remove(id);
  }
}
