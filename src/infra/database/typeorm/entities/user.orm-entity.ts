import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';
import { TicketOrmEntity } from './ticket.orm-entity';
import { CommentOrmEntity } from './comment.orm-entity';
import { ActivityLogOrmEntity } from './activity-log.orm-entity';
import { NotificationOrmEntity } from './notification.orm-entity';

export type UserStatusDb = 'ACTIVO' | 'INACTIVO';

@Entity({ name: 'usuarios' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_usuario', type: 'int' })
  idUsuario!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({
    name: 'estado',
    type: 'enum',
    enum: ['ACTIVO', 'INACTIVO'],
    default: 'ACTIVO',
  })
  estado!: UserStatusDb;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  @ManyToMany(() => RoleOrmEntity, (role) => role.usuarios)
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: { name: 'id_usuario', referencedColumnName: 'idUsuario' },
    inverseJoinColumn: { name: 'id_rol', referencedColumnName: 'idRol' },
  })
  roles!: RoleOrmEntity[];

  @OneToMany(() => TicketOrmEntity, (t) => t.cliente)
  ticketsComoCliente!: TicketOrmEntity[];

  @OneToMany(() => TicketOrmEntity, (t) => t.agente)
  ticketsComoAgente!: TicketOrmEntity[];

  @OneToMany(() => CommentOrmEntity, (c) => c.usuario)
  comentarios!: CommentOrmEntity[];

  @OneToMany(() => ActivityLogOrmEntity, (h) => h.usuario)
  historial!: ActivityLogOrmEntity[];

  @OneToMany(() => NotificationOrmEntity, (n) => n.usuario)
  notificaciones!: NotificationOrmEntity[];
}
