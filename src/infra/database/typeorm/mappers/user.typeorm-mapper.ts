import { User } from '../../../../domain/entities/user.entity';
import { UserRole } from '../../../../domain/value-objects/user-role.vo';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

const ROLE_PRIORITY: UserRole[] = [UserRole.ADMIN, UserRole.AGENT, UserRole.CLIENT];

function pickPrimaryRole(roles: RoleOrmEntity[] | undefined): UserRole {
  const names = (roles ?? [])
    .map((r) => r.nombre)
    .filter((v): v is UserRole => Object.values(UserRole).includes(v as UserRole));

  for (const preferred of ROLE_PRIORITY) {
    if (names.includes(preferred)) return preferred;
  }

  // Fallback: si no hay roles válidos en DB, mantenemos CLIENT.
  return UserRole.CLIENT;
}

export class UserTypeOrmMapper {
  static toDomain(row: UserOrmEntity): User {
    return new User(row.idUsuario, row.email, row.nombre, pickPrimaryRole(row.roles), row.passwordHash);
  }

  static toOrm(user: User, roles: RoleOrmEntity[]): Partial<UserOrmEntity> {
    return {
      idUsuario: user.id > 0 ? user.id : undefined,
      email: user.email,
      nombre: user.name,
      passwordHash: user.passwordHash,
      estado: 'ACTIVO',
      roles,
    };
  }
}
