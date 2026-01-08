import { User } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/value-objects/user-role.vo';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<number, User>();
  private nextId = 1;

  constructor() {
    const admin = new User(this.nextId++, 'admin@local.test', 'Admin', UserRole.ADMIN, 'admin');
    const agent = new User(this.nextId++, 'agent@local.test', 'Agent', UserRole.AGENT, 'agent');
    const client = new User(this.nextId++, 'client@local.test', 'Client', UserRole.CLIENT, 'client');
    [admin, agent, client].forEach((u) => this.users.set(u.id, u));
  }

  async findById(id: number): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) return user;
    }
    return null;
  }

  async create(user: User): Promise<User> {
    const id = user.id && user.id > 0 ? user.id : this.nextId++;
    const persisted = new User(id, user.email, user.name, user.role, user.passwordHash);
    this.users.set(persisted.id, persisted);
    return persisted;
  }

  async list(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
