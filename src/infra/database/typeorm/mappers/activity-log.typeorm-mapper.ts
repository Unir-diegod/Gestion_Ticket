import { ActivityLog } from '../../../../domain/entities/activity-log.entity';
import { ActivityLogOrmEntity } from '../entities/activity-log.orm-entity';

type ActivityMetadata = Record<string, unknown> | undefined;

function extractValorAnterior(metadata: ActivityMetadata): string | null {
  const from = metadata?.from;
  if (typeof from === 'string' || typeof from === 'number') return String(from);
  const valorAnterior = metadata?.valorAnterior;
  if (typeof valorAnterior === 'string' || typeof valorAnterior === 'number') return String(valorAnterior);
  return null;
}

function extractValorNuevo(metadata: ActivityMetadata): string | null {
  const to = metadata?.to;
  if (typeof to === 'string' || typeof to === 'number') return String(to);
  const assigned = metadata?.assignedAgentUserId;
  if (typeof assigned === 'string' || typeof assigned === 'number') return String(assigned);
  const valorNuevo = metadata?.valorNuevo;
  if (typeof valorNuevo === 'string' || typeof valorNuevo === 'number') return String(valorNuevo);
  return null;
}

export class ActivityLogTypeOrmMapper {
  static toOrm(log: ActivityLog): Partial<ActivityLogOrmEntity> {
    return {
      idHistorial: log.id && log.id > 0 ? log.id : undefined,
      idTicket: log.ticketId,
      idUsuario: log.performedByUserId,
      accion: log.action as any,
      valorAnterior: extractValorAnterior(log.metadata),
      valorNuevo: extractValorNuevo(log.metadata),
      fechaEvento: log.createdAt,
    };
  }

  static toDomain(row: ActivityLogOrmEntity): ActivityLog {
    const metadata: Record<string, unknown> | undefined =
      row.valorAnterior !== null || row.valorNuevo !== null
        ? { valorAnterior: row.valorAnterior, valorNuevo: row.valorNuevo }
        : undefined;

    return new ActivityLog(
      row.idHistorial,
      row.idTicket,
      row.accion,
      row.idUsuario,
      row.fechaEvento,
      metadata,
    );
  }
}
