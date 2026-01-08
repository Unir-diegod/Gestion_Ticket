import { Notification } from '../../../domain/entities/notification.entity';
import { INotificationRepository } from '../../../interfaces/repositories/notification.repository';

export class InMemoryNotificationRepository implements INotificationRepository {
  private readonly notifications: Notification[] = [];
  private nextId = 1;

  async create(notification: Notification): Promise<Notification> {
    const persisted = new Notification(
      notification.id && notification.id > 0 ? notification.id : this.nextId++,
      notification.type,
      notification.message,
      notification.createdAt,
      notification.userId,
      notification.ticketId,
    );
    this.notifications.push(persisted);
    return persisted;
  }
}
