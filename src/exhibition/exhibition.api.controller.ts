import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException,
  Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, Req, Res,
  UploadedFile, UseGuards, UseInterceptors, MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import {
  ApiBody, ApiCookieAuth, ApiConsumes, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiParam, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request, Response } from 'express';
import { PaginationDto, buildLinkHeader } from '../common/dto/pagination.dto';
import { ExhibitionService } from './exhibition.service';
import { PrismaService } from '../prisma.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { ExhibitionResponseDto } from './dto/exhibition-response.dto';
import { OrderItemResponseDto } from '../order/dto/order-item-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { StorageService } from '../storage/storage.service';
import { CacheControl } from '../common/decorators/cache-control.decorator';

@ApiTags('exhibitions')
@Controller('api/exhibitions')
export class ExhibitionApiController {
  constructor(
    private readonly exhibitionService: ExhibitionService,
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @CacheControl('public, max-age=3600, stale-while-revalidate=60')
  @ApiOperation({ summary: 'Получить все выставки (с пагинацией)' })
  @ApiOkResponse({ type: [ExhibitionResponseDto], description: 'Список выставок' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const all = await this.exhibitionService.findAll();
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', total);
    res.setHeader('Link', buildLinkHeader(req, page, limit, total, 3001));
    return data;
  }

  @Get(':id')
  @CacheControl('public, max-age=3600, stale-while-revalidate=60')
  @ApiOperation({ summary: 'Получить выставку по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ExhibitionResponseDto, description: 'Выставка найдена' })
  @ApiNotFoundResponse({ description: 'Выставка не найдена' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const exhibition = await this.exhibitionService.findOne(id);
    if (!exhibition) throw new NotFoundException(`Выставка #${id} не найдена`);
    return exhibition;
  }

  @Get(':id/order-items')
  @CacheControl('public, max-age=60')
  @ApiOperation({ summary: 'Получить позиции заказов для выставки' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: [OrderItemResponseDto], description: 'Список позиций заказов выставки' })
  @ApiNotFoundResponse({ description: 'Выставка не найдена' })
  async findOrderItems(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const exhibition = await this.exhibitionService.findOne(id);
    if (!exhibition) throw new NotFoundException(`Выставка #${id} не найдена`);
    const all = await this.prisma.orderItem.findMany({
      where: { exhibitionId: id },
      include: { order: true, hall: true },
    });
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const data = all.slice((page - 1) * limit, page * limit);
    res.setHeader('X-Total-Count', all.length);
    res.setHeader('Link', buildLinkHeader(req, page, limit, all.length, 3001));
    return data;
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Создать выставку' })
  @ApiBody({ type: CreateExhibitionDto })
  @ApiResponse({ status: 201, type: ExhibitionResponseDto, description: 'Выставка создана' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 409, description: 'Указанный зал не существует' })
  async create(@Body() dto: CreateExhibitionDto) {
    const hall = await this.prisma.hall.findUnique({ where: { id: dto.hallId } });
    if (!hall) throw new NotFoundException(`Зал #${dto.hallId} не найден`);
    return this.exhibitionService.create(dto as any);
  }

  @Post(':id/image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiCookieAuth('session')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить изображение выставки в Yandex Object Storage' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Изображение загружено, возвращает URL' })
  @ApiResponse({ status: 400, description: 'Неверный тип или размер файла' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiNotFoundResponse({ description: 'Выставка не найдена' })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp|gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const exhibition = await this.exhibitionService.findOne(id);
    if (!exhibition) throw new NotFoundException(`Выставка #${id} не найдена`);

    const ext = file.mimetype.split('/')[1];
    const key = `exhibitions/${id}.${ext}`;
    const url = await this.storageService.uploadFile(key, file.buffer, file.mimetype);
    return { url };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Обновить выставку' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateExhibitionDto })
  @ApiOkResponse({ type: ExhibitionResponseDto, description: 'Обновлённая выставка' })
  @ApiNotFoundResponse({ description: 'Выставка не найдена' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExhibitionDto) {
    const exhibition = await this.exhibitionService.findOne(id);
    if (!exhibition) throw new NotFoundException(`Выставка #${id} не найдена`);
    return this.exhibitionService.update(id, dto as any);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Удалить выставку' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Выставка удалена' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 409, description: 'Выставка используется в заказах' })
  @ApiNotFoundResponse({ description: 'Выставка не найдена' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const exhibition = await this.exhibitionService.findOne(id);
    if (!exhibition) throw new NotFoundException(`Выставка #${id} не найдена`);
    await this.exhibitionService.remove(id);
  }
}
