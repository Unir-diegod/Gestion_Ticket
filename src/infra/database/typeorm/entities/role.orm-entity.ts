import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ name: 'roles' })
export class RoleOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_rol', type: 'int' })
  idRol!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 50, unique: true })
  nombre!: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion!: string | null;

  @ManyToMany(() => UserOrmEntity, (u) => u.roles)
  usuarios!: UserOrmEntity[];
}
