import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../../../../domain/entities/activity-log.entity';
import type { IHistoryRepository } from '../../../../interfaces/repositories/history.repository';
import { ActivityLogOrmEntity } from '../entities/activity-log.orm-entity';
import { ActivityLogTypeOrmMapper } from '../mappers/activity-log.typeorm-mapper';

@Injectable()
export class MysqlHistoryRepository implements IHistoryRepository {
  constructor(
    @InjectRepository(ActivityLogOrmEntity)
    private readonly logs: Repository<ActivityLogOrmEntity>,
  ) {}

  async append(log: ActivityLog): Promise<void> {
    const row = this.logs.create(ActivityLogTypeOrmMapper.toOrm(log));
    await this.logs.save(row);
  }

  async listByTicketId(ticketId: number): Promise<ActivityLog[]> {
    const rows = await this.logs.find({ where: { idTicket: ticketId }, order: { fechaEvento: 'ASC' } });
    return rows.map(ActivityLogTypeOrmMapper.toDomain);
  }
}
