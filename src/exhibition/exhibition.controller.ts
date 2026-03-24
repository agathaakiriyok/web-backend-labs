import { Controller, Get, Post, Body, Param, Redirect, Render, Query, Sse } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const exhibitionEvents = new Subject<string>();

@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Get()
  @Render('exhibitions/index')
  async findAll(@Query('auth') auth?: string) {
    const exhibitions = await this.exhibitionService.findAll();
    return { exhibitions, isAuth: auth === 'true', username: 'Агата' };
  }

  @Get('add')
  @Render('exhibitions/add')
  addForm(@Query('auth') auth?: string) {
    return { isAuth: auth === 'true', username: 'Агата' };
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    return exhibitionEvents.pipe(
      map((data) => ({ data } as MessageEvent)),
    );
  }
  
  @Get(':id/edit')
  @Render('exhibitions/edit')
  async editForm(@Param('id') id: string, @Query('auth') auth?: string) {
    const exhibition = await this.exhibitionService.findOne(Number(id));
    return { exhibition, isAuth: auth === 'true', username: 'Агата' };
  }

  @Get(':id')
  @Render('exhibitions/show')
  async findOne(@Param('id') id: string, @Query('auth') auth?: string) {
    const exhibition = await this.exhibitionService.findOne(Number(id));
    return { exhibition, isAuth: auth === 'true', username: 'Агата' };
  }

  @Post()
  @Redirect('/exhibitions')
  async create(@Body() body: any) {
    await this.exhibitionService.create(body);
    exhibitionEvents.next(`Добавлена выставка: ${body.name}`);
    return { url: '/exhibitions' };
  }

  @Post(':id/update')
  @Redirect('/exhibitions')
  async update(@Param('id') id: string, @Body() body: any) {
    await this.exhibitionService.update(Number(id), body);
    exhibitionEvents.next(`Обновлена выставка: ${body.name}`);
    return { url: '/exhibitions' };
  }

  @Post(':id/delete')
  @Redirect('/exhibitions')
  async remove(@Param('id') id: string) {
    await this.exhibitionService.remove(Number(id));
    exhibitionEvents.next('Выставка удалена');
    return { url: '/exhibitions' };
  }
}