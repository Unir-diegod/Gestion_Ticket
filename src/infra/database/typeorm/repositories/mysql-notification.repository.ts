import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../../../domain/entities/notification.entity';
import type { INotificationRepository } from '../../../../interfaces/repositories/notification.repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import { NotificationTypeOrmMapper } from '../mappers/notification.typeorm-mapper';

@Injectable()
export class MysqlNotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly notifications: Repository<NotificationOrmEntity>,
  ) {}

  async create(notification: Notification): Promise<Notification> {
    const row = this.notifications.create(NotificationTypeOrmMapper.toOrm(notification));
    const saved = await this.notifications.save(row);
    return NotificationTypeOrmMapper.toDomain(saved);
  }
}
