import { Ticket } from '../../../../domain/entities/ticket.entity';
import { TicketPriority } from '../../../../domain/value-objects/ticket-priority.vo';
import { TicketStatus } from '../../../../domain/value-objects/ticket-status.vo';
import { TicketOrmEntity } from '../entities/ticket.orm-entity';

export class TicketTypeOrmMapper {
  static toDomain(row: TicketOrmEntity): Ticket {
    return new Ticket(
      row.idTicket,
      row.titulo,
      row.descripcion,
      row.idCliente,
      row.estado as TicketStatus,
      row.prioridad as TicketPriority,
      row.idAgente,
      row.fechaCreacion,
      row.fechaActualizacion,
    );
  }

  static toOrm(ticket: Ticket): Partial<TicketOrmEntity> {
    return {
      idTicket: ticket.id > 0 ? ticket.id : undefined,
      titulo: ticket.title,
      descripcion: ticket.description,
      estado: ticket.status,
      prioridad: ticket.priority,
      idCliente: ticket.createdByUserId,
      idAgente: ticket.assignedAgentUserId,
      fechaCreacion: ticket.createdAt,
      fechaActualizacion: ticket.updatedAt,
      fechaCierre: ticket.status === TicketStatus.CLOSED ? ticket.updatedAt : null,
    };
  }
}
