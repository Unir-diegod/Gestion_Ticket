import { ActivityLog } from '../../../domain/entities/activity-log.entity';
import { IHistoryRepository } from '../../../interfaces/repositories/history.repository';

export class InMemoryHistoryRepository implements IHistoryRepository {
  private readonly logs: ActivityLog[] = [];
  private nextId = 1;

  async append(log: ActivityLog): Promise<void> {
    const persisted = new ActivityLog(
      log.id && log.id > 0 ? log.id : this.nextId++,
      log.ticketId,
      log.action,
      log.performedByUserId,
      log.createdAt,
      log.metadata,
    );
    this.logs.push(persisted);
  }

  async listByTicketId(ticketId: number): Promise<ActivityLog[]> {
    return this.logs.filter((l) => l.ticketId === ticketId);
  }
}
