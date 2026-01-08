import { Notification } from '../../../../domain/entities/notification.entity';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';

export class NotificationTypeOrmMapper {
  static toOrm(notification: Notification): Partial<NotificationOrmEntity> {
    if (!notification.userId) {
      throw new Error('Notification.userId is required to persist');
    }

    return {
      idNotificacion: notification.id && notification.id > 0 ? notification.id : undefined,
      idUsuario: notification.userId,
      tipo: notification.type as any,
      mensaje: notification.message,
      leida: 0,
      fechaEnvio: notification.createdAt,
    };
  }

  static toDomain(row: NotificationOrmEntity): Notification {
    return new Notification(
      row.idNotificacion,
      row.tipo,
      row.mensaje,
      row.fechaEnvio,
      row.idUsuario,
      undefined,
    );
  }
}
