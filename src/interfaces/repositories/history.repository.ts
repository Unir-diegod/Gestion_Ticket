import { ActivityLog } from '../../domain/entities/activity-log.entity';

export const HISTORY_REPOSITORY = Symbol('HISTORY_REPOSITORY');

export interface IHistoryRepository {
  append(log: ActivityLog): Promise<void>;
  listByTicketId(ticketId: number): Promise<ActivityLog[]>;
}
