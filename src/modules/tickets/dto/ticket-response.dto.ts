import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority } from '../../../domain/value-objects/ticket-priority.vo';
import { TicketStatus } from '../../../domain/value-objects/ticket-status.vo';

export class TicketResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: TicketStatus })
  status!: TicketStatus;

  @ApiProperty({ enum: TicketPriority })
  priority!: TicketPriority;

  @ApiProperty()
  createdByUserId!: string;

  @ApiProperty({ nullable: true })
  assignedAgentUserId!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
