import { Ticket } from '../../domain/entities/ticket.entity';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface ITicketRepository {
  findById(id: number): Promise<Ticket | null>;
  create(ticket: Ticket): Promise<Ticket>;
  update(ticket: Ticket): Promise<void>;
  list(): Promise<Ticket[]>;
}
