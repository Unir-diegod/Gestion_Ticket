import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketAssignedEvent } from '../../domain/events/ticket-assigned.event';
import { TicketCreatedEvent } from '../../domain/events/ticket-created.event';
import { TicketStatusChangedEvent } from '../../domain/events/ticket-status-changed.event';
import { TicketPriority } from '../../domain/value-objects/ticket-priority.vo';
import { TicketStatus } from '../../domain/value-objects/ticket-status.vo';
import { UserRole } from '../../domain/value-objects/user-role.vo';
import { TICKET_REPOSITORY } from '../../interfaces/repositories/ticket.repository';
import type { ITicketRepository } from '../../interfaces/repositories/ticket.repository';
import { USER_REPOSITORY } from '../../interfaces/repositories/user.repository';
import type { IUserRepository } from '../../interfaces/repositories/user.repository';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

export type AuthUser = {
  id: number;
  role: UserRole;
};

@Injectable()
export class TicketsService {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketsRepo: ITicketRepository,
    @Inject(USER_REPOSITORY) private readonly usersRepo: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private ensureNotClosed(ticket: Ticket) {
    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Ticket is CLOSED and cannot be modified');
    }
  }

  async create(dto: CreateTicketDto, user: AuthUser): Promise<Ticket> {
    const now = new Date();
    const transient = new Ticket(
      0,
      dto.title,
      dto.description,
      user.id,
      TicketStatus.OPEN,
      dto.priority ?? TicketPriority.MEDIUM,
      null,
      now,
      now,
    );

    const ticket = await this.ticketsRepo.create(transient);
    this.eventEmitter.emit(
      TicketCreatedEvent.eventName,
      new TicketCreatedEvent(ticket.id, ticket.createdByUserId),
    );
    return ticket;
  }

  async list(user: AuthUser): Promise<Ticket[]> {
    const tickets = await this.ticketsRepo.list();
    if (user.role === UserRole.CLIENT) {
      return tickets.filter((t) => t.createdByUserId === user.id);
    }
    return tickets;
  }

  async assign(ticketId: string, dto: AssignTicketDto, user: AuthUser): Promise<Ticket> {
    const parsedTicketId = Number(ticketId);
    if (!Number.isFinite(parsedTicketId)) throw new BadRequestException('Invalid ticket id');

    const ticket = await this.ticketsRepo.findById(parsedTicketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    this.ensureNotClosed(ticket);

    const agent = await this.usersRepo.findById(dto.agentUserId);
    if (!agent) throw new NotFoundException('Agent not found');
    if (agent.role !== UserRole.AGENT) {
      throw new BadRequestException('Assigned user must have AGENT role');
    }

    const isReassignment =
      ticket.assignedAgentUserId !== null && ticket.assignedAgentUserId !== dto.agentUserId;
    if (isReassignment && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can reassign tickets');
    }
    if (!isReassignment && user.role === UserRole.CLIENT) {
      throw new ForbiddenException('CLIENT cannot assign tickets');
    }

    ticket.assignedAgentUserId = dto.agentUserId;
    ticket.updatedAt = new Date();
    await this.ticketsRepo.update(ticket);

    this.eventEmitter.emit(
      TicketAssignedEvent.eventName,
      new TicketAssignedEvent(ticket.id, dto.agentUserId, user.id, isReassignment),
    );

    return ticket;
  }

  async changeStatus(ticketId: string, dto: ChangeStatusDto, user: AuthUser): Promise<Ticket> {
    const parsedTicketId = Number(ticketId);
    if (!Number.isFinite(parsedTicketId)) throw new BadRequestException('Invalid ticket id');

    const ticket = await this.ticketsRepo.findById(parsedTicketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    this.ensureNotClosed(ticket);

    if (user.role === UserRole.CLIENT) {
      throw new ForbiddenException('CLIENT cannot change status');
    }

    if (user.role === UserRole.AGENT) {
      if (!ticket.assignedAgentUserId || ticket.assignedAgentUserId !== user.id) {
        throw new ForbiddenException('AGENT can only change status of assigned tickets');
      }
    }

    const from = ticket.status;
    const to = dto.status;
    ticket.status = to;
    ticket.updatedAt = new Date();
    await this.ticketsRepo.update(ticket);

    this.eventEmitter.emit(
      TicketStatusChangedEvent.eventName,
      new TicketStatusChangedEvent(ticket.id, from, to, user.id),
    );

    return ticket;
  }
}
