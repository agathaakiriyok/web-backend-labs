import { Controller, Get, Post, Body, Param, Redirect, Render, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @Render('tickets/index')
  async findAll(@Query('auth') auth?: string) {
    const tickets = await this.ticketService.findAll();
    return { tickets, isAuth: auth === 'true', username: 'Агата' };
  }

  @Get('add')
  @Render('tickets/add')
  addForm(@Query('auth') auth?: string) {
    return { isAuth: auth === 'true', username: 'Агата' };
  }

  @Post()
  @Redirect('/tickets')
  async create(@Body() body: any) {
    await this.ticketService.create(body);
    return { url: '/tickets' };
  }

  @Post(':id/delete')
  @Redirect('/tickets')
  async remove(@Param('id') id: string) {
    await this.ticketService.remove(Number(id));
    return { url: '/tickets' };
  }
}