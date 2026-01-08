import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../../../domain/entities/ticket.entity';
import type { ITicketRepository } from '../../../../interfaces/repositories/ticket.repository';
import { TicketOrmEntity } from '../entities/ticket.orm-entity';
import { TicketTypeOrmMapper } from '../mappers/ticket.typeorm-mapper';

@Injectable()
export class MysqlTicketRepository implements ITicketRepository {
  constructor(
    @InjectRepository(TicketOrmEntity)
    private readonly tickets: Repository<TicketOrmEntity>,
  ) {}

  async findById(id: number): Promise<Ticket | null> {
    const row = await this.tickets.findOne({ where: { idTicket: id } });
    return row ? TicketTypeOrmMapper.toDomain(row) : null;
  }

  async create(ticket: Ticket): Promise<Ticket> {
    const row = this.tickets.create(TicketTypeOrmMapper.toOrm(ticket));
    const saved = await this.tickets.save(row);
    return TicketTypeOrmMapper.toDomain(saved);
  }

  async update(ticket: Ticket): Promise<void> {
    const row = this.tickets.create(TicketTypeOrmMapper.toOrm(ticket));
    await this.tickets.save(row);
  }

  async list(): Promise<Ticket[]> {
    const rows = await this.tickets.find();
    return rows.map(TicketTypeOrmMapper.toDomain);
  }
}
