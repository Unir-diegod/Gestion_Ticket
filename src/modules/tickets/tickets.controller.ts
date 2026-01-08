import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { TicketMapper } from './mappers/ticket.mapper';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOkResponse({ type: TicketResponseDto })
  async create(@Body() dto: CreateTicketDto, @Req() req: any): Promise<TicketResponseDto> {
    const ticket = await this.ticketsService.create(dto, req.user);
    return TicketMapper.toResponse(ticket);
  }

  @Get()
  @ApiOkResponse({ type: TicketResponseDto, isArray: true })
  async list(@Req() req: any): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketsService.list(req.user);
    return tickets.map(TicketMapper.toResponse);
  }

  @Post(':id/assign')
  @ApiOkResponse({ type: TicketResponseDto })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignTicketDto,
    @Req() req: any,
  ): Promise<TicketResponseDto> {
    const ticket = await this.ticketsService.assign(id, dto, req.user);
    return TicketMapper.toResponse(ticket);
  }

  @Post(':id/status')
  @ApiOkResponse({ type: TicketResponseDto })
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
    @Req() req: any,
  ): Promise<TicketResponseDto> {
    const ticket = await this.ticketsService.changeStatus(id, dto, req.user);
    return TicketMapper.toResponse(ticket);
  }
}
