import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { CommentOrmEntity } from './comment.orm-entity';
import { AttachmentOrmEntity } from './attachment.orm-entity';
import { ActivityLogOrmEntity } from './activity-log.orm-entity';

export type TicketStatusDb = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type TicketPriorityDb = 'LOW' | 'MEDIUM' | 'HIGH';

@Entity({ name: 'tickets' })
export class TicketOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_ticket', type: 'int' })
  idTicket!: number;

  @Column({ name: 'titulo', type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ name: 'descripcion', type: 'text' })
  descripcion!: string;

  @Index('idx_ticket_estado')
  @Column({
    name: 'estado',
    type: 'enum',
    enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
    default: 'OPEN',
  })
  estado!: TicketStatusDb;

  @Index('idx_ticket_prioridad')
  @Column({
    name: 'prioridad',
    type: 'enum',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM',
  })
  prioridad!: TicketPriorityDb;

  @Index('idx_ticket_cliente')
  @Column({ name: 'id_cliente', type: 'int' })
  idCliente!: number;

  @ManyToOne(() => UserOrmEntity, (u) => u.ticketsComoCliente)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'idUsuario' })
  cliente!: UserOrmEntity;

  @Index('idx_ticket_agente')
  @Column({ name: 'id_agente', type: 'int', nullable: true })
  idAgente!: number | null;

  @ManyToOne(() => UserOrmEntity, (u) => u.ticketsComoAgente, { nullable: true })
  @JoinColumn({ name: 'id_agente', referencedColumnName: 'idUsuario' })
  agente!: UserOrmEntity | null;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fechaActualizacion!: Date;

  @Column({ name: 'fecha_cierre', type: 'timestamp', nullable: true })
  fechaCierre!: Date | null;

  @OneToMany(() => CommentOrmEntity, (c) => c.ticket)
  comentarios!: CommentOrmEntity[];

  @OneToMany(() => AttachmentOrmEntity, (a) => a.ticket)
  adjuntos!: AttachmentOrmEntity[];

  @OneToMany(() => ActivityLogOrmEntity, (h) => h.ticket)
  historial!: ActivityLogOrmEntity[];
}
