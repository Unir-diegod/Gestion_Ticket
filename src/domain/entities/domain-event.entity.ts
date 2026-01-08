export type DomainEventType = 'TICKET_CREATED' | 'TICKET_ASSIGNED' | 'TICKET_STATUS_CHANGED';

export class DomainEvent {
  constructor(
    public readonly id: number,
    public readonly type: DomainEventType,
    public readonly entity: string,
    public readonly entityId: number,
    public readonly payload: unknown | null,
    public readonly occurredAt: Date,
  ) {}
}
