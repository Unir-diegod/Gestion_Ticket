import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

export type NotificationTypeDb = 'EMAIL' | 'WEBSOCKET' | 'LOG';

@Entity({ name: 'notificaciones' })
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_notificacion', type: 'int' })
  idNotificacion!: number;

  @Column({ name: 'id_usuario', type: 'int' })
  idUsuario!: number;

  @ManyToOne(() => UserOrmEntity, (u) => u.notificaciones)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'idUsuario' })
  usuario!: UserOrmEntity;

  @Column({ name: 'tipo', type: 'enum', enum: ['EMAIL', 'WEBSOCKET', 'LOG'] })
  tipo!: NotificationTypeDb;

  @Column({ name: 'mensaje', type: 'varchar', length: 255 })
  mensaje!: string;

  @Column({ name: 'leida', type: 'tinyint', width: 1, default: () => '0' })
  leida!: number;

  @Column({ name: 'fecha_envio', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEnvio!: Date;
}
