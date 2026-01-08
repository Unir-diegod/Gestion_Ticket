import { Notification } from '../../domain/entities/notification.entity';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
}
