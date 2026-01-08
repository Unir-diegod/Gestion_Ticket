export class TicketAssignedEvent {
  static readonly eventName = 'ticket.assigned';

  constructor(
    public readonly ticketId: number,
    public readonly assignedAgentUserId: number,
    public readonly performedByUserId: number,
    public readonly isReassignment: boolean,
  ) {}
}
