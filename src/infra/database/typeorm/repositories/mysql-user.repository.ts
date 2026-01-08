import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { UserRole } from '../../../../domain/value-objects/user-role.vo';
import type { IUserRepository } from '../../../../interfaces/repositories/user.repository';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserTypeOrmMapper } from '../mappers/user.typeorm-mapper';

@Injectable()
export class MysqlUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roles: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const row = await this.users.findOne({ where: { idUsuario: id }, relations: { roles: true } });
    return row ? UserTypeOrmMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.users.findOne({ where: { email }, relations: { roles: true } });
    return row ? UserTypeOrmMapper.toDomain(row) : null;
  }

  private async getOrCreateRole(nombre: UserRole): Promise<RoleOrmEntity> {
    const existing = await this.roles.findOne({ where: { nombre } });
    if (existing) return existing;

    const created = this.roles.create({ nombre, descripcion: null });
    return this.roles.save(created);
  }

  async create(user: User): Promise<User> {
    const role = await this.getOrCreateRole(user.role);
    const row = this.users.create(UserTypeOrmMapper.toOrm(user, [role]));
    const saved = await this.users.save(row);

    const reloaded = await this.users.findOne({
      where: { idUsuario: saved.idUsuario },
      relations: { roles: true },
    });

    return UserTypeOrmMapper.toDomain(reloaded ?? saved);
  }

  async list(): Promise<User[]> {
    const rows = await this.users.find({ relations: { roles: true } });
    return rows.map(UserTypeOrmMapper.toDomain);
  }
}
