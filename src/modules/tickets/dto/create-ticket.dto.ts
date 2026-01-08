import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { TicketPriority } from '../../../domain/value-objects/ticket-priority.vo';

export class CreateTicketDto {
  @ApiProperty({ example: 'No puedo iniciar sesión' })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: 'Detalles del problema...' })
  @IsString()
  @MinLength(3)
  description!: string;

  @ApiProperty({ enum: TicketPriority, example: TicketPriority.MEDIUM })
  @IsEnum(TicketPriority)
  priority!: TicketPriority;
}
