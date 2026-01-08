import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  ticketId!: string;

  @ApiProperty()
  action!: string;

  @ApiProperty()
  performedByUserId!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ required: false, type: Object })
  metadata?: Record<string, unknown>;
}
