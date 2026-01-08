import { Ticket } from '../../../domain/entities/ticket.entity';
import { TicketResponseDto } from '../dto/ticket-response.dto';

export class TicketMapper {
  static toResponse(ticket: Ticket): TicketResponseDto {
    return {
      id: String(ticket.id),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdByUserId: String(ticket.createdByUserId),
      assignedAgentUserId: ticket.assignedAgentUserId === null ? null : String(ticket.assignedAgentUserId),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }
}
