import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicketOrmEntity } from './ticket.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

export type ActivityActionDb =
  | 'CREADO'
  | 'ASIGNADO'
  | 'REASIGNADO'
  | 'CAMBIO_ESTADO'
  | 'COMENTARIO'
  | 'CIERRE';

@Entity({ name: 'historial_actividad' })
export class ActivityLogOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_historial', type: 'int' })
  idHistorial!: number;

  @Column({ name: 'id_ticket', type: 'int' })
  idTicket!: number;

  @ManyToOne(() => TicketOrmEntity, (t) => t.historial)
  @JoinColumn({ name: 'id_ticket', referencedColumnName: 'idTicket' })
  ticket!: TicketOrmEntity;

  @Column({ name: 'id_usuario', type: 'int' })
  idUsuario!: number;

  @ManyToOne(() => UserOrmEntity, (u) => u.historial)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'idUsuario' })
  usuario!: UserOrmEntity;

  @Column({
    name: 'accion',
    type: 'enum',
    enum: ['CREADO', 'ASIGNADO', 'REASIGNADO', 'CAMBIO_ESTADO', 'COMENTARIO', 'CIERRE'],
  })
  accion!: ActivityActionDb;

  @Column({ name: 'valor_anterior', type: 'varchar', length: 255, nullable: true })
  valorAnterior!: string | null;

  @Column({ name: 'valor_nuevo', type: 'varchar', length: 255, nullable: true })
  valorNuevo!: string | null;

  @Column({ name: 'fecha_evento', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEvento!: Date;
}
