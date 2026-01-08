import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type DomainEventTypeDb = 'TICKET_CREATED' | 'TICKET_ASSIGNED' | 'TICKET_STATUS_CHANGED';

@Entity({ name: 'eventos_dominio' })
export class DomainEventOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_evento', type: 'int' })
  idEvento!: number;

  @Column({
    name: 'tipo_evento',
    type: 'enum',
    enum: ['TICKET_CREATED', 'TICKET_ASSIGNED', 'TICKET_STATUS_CHANGED'],
  })
  tipoEvento!: DomainEventTypeDb;

  @Column({ name: 'entidad', type: 'varchar', length: 50 })
  entidad!: string;

  @Column({ name: 'entidad_id', type: 'int' })
  entidadId!: number;

  @Column({ name: 'payload', type: 'longtext', nullable: true })
  payload!: string | null;

  @Column({ name: 'fecha_evento', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEvento!: Date;
}
