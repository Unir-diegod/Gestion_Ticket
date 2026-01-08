import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TicketAssignedEvent } from '../../domain/events/ticket-assigned.event';
import { TicketCreatedEvent } from '../../domain/events/ticket-created.event';
import { TicketStatusChangedEvent } from '../../domain/events/ticket-status-changed.event';
import { WsGateway } from './ws.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly wsGateway: WsGateway) {}

  notify(type: string, message: string, payload?: Record<string, unknown>) {
    this.logger.log(`[notify] ${type}: ${message}`);
    this.wsGateway.broadcast(type, { message, ...payload });
  }

  @OnEvent(TicketCreatedEvent.eventName)
  onTicketCreated(event: TicketCreatedEvent) {
    this.notify('ticket.created', `Ticket creado: ${event.ticketId}`, { ticketId: event.ticketId });
  }

  @OnEvent(TicketAssignedEvent.eventName)
  onTicketAssigned(event: TicketAssignedEvent) {
    this.notify('ticket.assigned', `Ticket asignado: ${event.ticketId}`, {
      ticketId: event.ticketId,
      assignedAgentUserId: event.assignedAgentUserId,
      isReassignment: event.isReassignment,
    });
  }

  @OnEvent(TicketStatusChangedEvent.eventName)
  onTicketStatusChanged(event: TicketStatusChangedEvent) {
    this.notify('ticket.statusChanged', `Estado actualizado: ${event.ticketId}`, {
      ticketId: event.ticketId,
      from: event.from,
      to: event.to,
    });
  }
}
