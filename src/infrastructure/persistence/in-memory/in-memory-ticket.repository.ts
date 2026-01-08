import { Ticket } from '../../../domain/entities/ticket.entity';
import { ITicketRepository } from '../../../interfaces/repositories/ticket.repository';

export class InMemoryTicketRepository implements ITicketRepository {
  private readonly tickets = new Map<number, Ticket>();
  private nextId = 1;

  async findById(id: number): Promise<Ticket | null> {
    return this.tickets.get(id) ?? null;
  }

  async create(ticket: Ticket): Promise<Ticket> {
    const id = ticket.id && ticket.id > 0 ? ticket.id : this.nextId++;
    const persisted = new Ticket(
      id,
      ticket.title,
      ticket.description,
      ticket.createdByUserId,
      ticket.status,
      ticket.priority,
      ticket.assignedAgentUserId,
      ticket.createdAt,
      ticket.updatedAt,
    );
    this.tickets.set(persisted.id, persisted);
    return persisted;
  }

  async update(ticket: Ticket): Promise<void> {
    this.tickets.set(ticket.id, ticket);
  }

  async list(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }
}
