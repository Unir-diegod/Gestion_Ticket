import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicketOrmEntity } from './ticket.orm-entity';
import { CommentOrmEntity } from './comment.orm-entity';

@Entity({ name: 'adjuntos' })
export class AttachmentOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_adjunto', type: 'int' })
  idAdjunto!: number;

  @Column({ name: 'id_ticket', type: 'int' })
  idTicket!: number;

  @ManyToOne(() => TicketOrmEntity, (t) => t.adjuntos)
  @JoinColumn({ name: 'id_ticket', referencedColumnName: 'idTicket' })
  ticket!: TicketOrmEntity;

  @Column({ name: 'id_comentario', type: 'int', nullable: true })
  idComentario!: number | null;

  @ManyToOne(() => CommentOrmEntity, (c) => c.adjuntos, { nullable: true })
  @JoinColumn({ name: 'id_comentario', referencedColumnName: 'idComentario' })
  comentario!: CommentOrmEntity | null;

  @Column({ name: 'nombre_archivo', type: 'varchar', length: 255 })
  nombreArchivo!: string;

  @Column({ name: 'tipo_archivo', type: 'varchar', length: 100 })
  tipoArchivo!: string;

  @Column({ name: 'ruta', type: 'varchar', length: 255 })
  ruta!: string;

  @Column({ name: 'fecha_subida', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaSubida!: Date;
}
