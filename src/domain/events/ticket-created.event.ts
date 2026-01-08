export class TicketCreatedEvent {
  static readonly eventName = 'ticket.created';

  constructor(
    public readonly ticketId: number,
    public readonly createdByUserId: number,
  ) {}
}
