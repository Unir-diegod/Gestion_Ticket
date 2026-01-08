import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../interfaces/repositories/user.repository';
import type { IUserRepository } from '../../interfaces/repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly usersRepo: IUserRepository) {}

  async findById(id: string | number): Promise<User | null> {
    const parsed = typeof id === 'number' ? id : Number(id);
    if (!Number.isFinite(parsed)) return null;
    return this.usersRepo.findById(parsed);
  }

  async getByIdOrThrow(id: string | number): Promise<User> {
    const parsed = typeof id === 'number' ? id : Number(id);
    if (!Number.isFinite(parsed)) throw new NotFoundException('User not found');
    const user = await this.usersRepo.findById(parsed);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findByEmail(email);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const transient = new User(0, dto.email, dto.name, dto.role, dto.password);
    return this.usersRepo.create(transient);
  }

  async list(): Promise<User[]> {
    return this.usersRepo.list();
  }
}
