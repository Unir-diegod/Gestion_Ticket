import { TicketStatus } from '../value-objects/ticket-status.vo';

export class TicketStatusChangedEvent {
  static readonly eventName = 'ticket.statusChanged';

  constructor(
    public readonly ticketId: number,
    public readonly from: TicketStatus,
    public readonly to: TicketStatus,
    public readonly performedByUserId: number,
  ) {}
}
