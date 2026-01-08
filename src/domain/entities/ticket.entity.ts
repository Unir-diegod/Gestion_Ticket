import { TicketPriority } from '../value-objects/ticket-priority.vo';
import { TicketStatus } from '../value-objects/ticket-status.vo';

export class Ticket {
  private _title: string;
  private _description: string;
  private _status: TicketStatus;
  private _priority: TicketPriority;
  private _assignedAgentUserId: number | null;
  private _updatedAt: Date;

  constructor(
    public readonly id: number,
    title: string,
    description: string,
    public readonly createdByUserId: number,
    status: TicketStatus,
    priority: TicketPriority,
    assignedAgentUserId: number | null,
    public readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this._title = title;
    this._description = description;
    this._status = status;
    this._priority = priority;
    this._assignedAgentUserId = assignedAgentUserId;
    this._updatedAt = updatedAt;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this.ensureNotClosed();
    if (!value || value.trim().length < 3) {
      throw new Error('Invalid ticket title');
    }
    this._title = value.trim();
    this.touch();
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this.ensureNotClosed();
    if (!value || value.trim().length < 3) {
      throw new Error('Invalid ticket description');
    }
    this._description = value.trim();
    this.touch();
  }

  get status(): TicketStatus {
    return this._status;
  }

  set status(value: TicketStatus) {
    this.ensureNotClosed();
    this._status = value;
    this.touch();
  }

  get priority(): TicketPriority {
    return this._priority;
  }

  set priority(value: TicketPriority) {
    this.ensureNotClosed();
    this._priority = value;
    this.touch();
  }

  get assignedAgentUserId(): number | null {
    return this._assignedAgentUserId;
  }

  set assignedAgentUserId(value: number | null) {
    this.ensureNotClosed();
    this._assignedAgentUserId = value;
    this.touch();
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  ensureNotClosed() {
    if (this._status === TicketStatus.CLOSED) {
      throw new Error('Ticket is CLOSED and cannot be modified');
    }
  }

  touch() {
    this._updatedAt = new Date();
  }

  assignTo(agentUserId: number) {
    this.ensureNotClosed();
    this.assignedAgentUserId = agentUserId;
  }

  changeStatus(next: TicketStatus) {
    this.ensureNotClosed();
    this.status = next;
  }
}
