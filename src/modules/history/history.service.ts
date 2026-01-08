import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLog } from '../../domain/entities/activity-log.entity';
import { TicketAssignedEvent } from '../../domain/events/ticket-assigned.event';
import { TicketCreatedEvent } from '../../domain/events/ticket-created.event';
import { TicketStatusChangedEvent } from '../../domain/events/ticket-status-changed.event';
import { HISTORY_REPOSITORY } from '../../interfaces/repositories/history.repository';
import type { IHistoryRepository } from '../../interfaces/repositories/history.repository';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(@Inject(HISTORY_REPOSITORY) private readonly historyRepo: IHistoryRepository) {}

  async append(
    ticketId: number,
    action: string,
    performedByUserId: number,
    metadata?: Record<string, unknown>,
  ) {
    const log = new ActivityLog(0, ticketId, action, performedByUserId, new Date(), metadata);
    await this.historyRepo.append(log);
  }

  @OnEvent(TicketCreatedEvent.eventName)
  async onTicketCreated(event: TicketCreatedEvent) {
    await this.append(event.ticketId, 'CREADO', event.createdByUserId);
    this.logger.log(`History: ticket created ${event.ticketId}`);
  }

  @OnEvent(TicketAssignedEvent.eventName)
  async onTicketAssigned(event: TicketAssignedEvent) {
    await this.append(
      event.ticketId,
      event.isReassignment ? 'REASIGNADO' : 'ASIGNADO',
      event.performedByUserId,
      { assignedAgentUserId: event.assignedAgentUserId },
    );
    this.logger.log(`History: ticket assigned ${event.ticketId}`);
  }

  @OnEvent(TicketStatusChangedEvent.eventName)
  async onTicketStatusChanged(event: TicketStatusChangedEvent) {
    await this.append(event.ticketId, event.to === 'CLOSED' ? 'CIERRE' : 'CAMBIO_ESTADO', event.performedByUserId, {
      from: event.from,
      to: event.to,
    });
    this.logger.log(`History: ticket status changed ${event.ticketId}`);
  }
}
