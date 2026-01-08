import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicketOrmEntity } from './ticket.orm-entity';
import { UserOrmEntity } from './user.orm-entity';
import { AttachmentOrmEntity } from './attachment.orm-entity';
import { OneToMany } from 'typeorm';

@Entity({ name: 'comentarios' })
export class CommentOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_comentario', type: 'int' })
  idComentario!: number;

  @Column({ name: 'id_ticket', type: 'int' })
  idTicket!: number;

  @ManyToOne(() => TicketOrmEntity, (t) => t.comentarios)
  @JoinColumn({ name: 'id_ticket', referencedColumnName: 'idTicket' })
  ticket!: TicketOrmEntity;

  @Column({ name: 'id_usuario', type: 'int' })
  idUsuario!: number;

  @ManyToOne(() => UserOrmEntity, (u) => u.comentarios)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'idUsuario' })
  usuario!: UserOrmEntity;

  @Column({ name: 'contenido', type: 'text' })
  contenido!: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  @OneToMany(() => AttachmentOrmEntity, (a) => a.comentario)
  adjuntos!: AttachmentOrmEntity[];
}
