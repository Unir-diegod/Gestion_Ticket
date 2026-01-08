import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditTriggers1700000000100 implements MigrationInterface {
  name = 'AuditTriggers1700000000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Idempotencia: eliminamos primero si existen.
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_tickets_ai_audit');
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_tickets_au_audit');
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_comentarios_ai_audit');

    // tickets: AFTER INSERT
    await queryRunner.query(`
CREATE TRIGGER trg_tickets_ai_audit
AFTER INSERT ON tickets
FOR EACH ROW
BEGIN
  -- Historial: CREADO
  INSERT INTO historial_actividad (
    id_ticket,
    id_usuario,
    accion,
    valor_anterior,
    valor_nuevo,
    fecha_evento
  ) VALUES (
    NEW.id_ticket,
    NEW.id_cliente,
    'CREADO',
    NULL,
    NULL,
    NOW()
  );

  -- Evento dominio: TICKET_CREATED
  INSERT INTO eventos_dominio (
    tipo_evento,
    entidad,
    entidad_id,
    payload,
    fecha_evento
  ) VALUES (
    'TICKET_CREATED',
    'tickets',
    NEW.id_ticket,
    JSON_OBJECT(
      'id_ticket', NEW.id_ticket,
      'estado', NEW.estado,
      'prioridad', NEW.prioridad,
      'id_cliente', NEW.id_cliente,
      'id_agente', NEW.id_agente
    ),
    NOW()
  );
END
`);

    // tickets: AFTER UPDATE
    await queryRunner.query(`
CREATE TRIGGER trg_tickets_au_audit
AFTER UPDATE ON tickets
FOR EACH ROW
BEGIN
  DECLARE v_actor_id INT;
  SET v_actor_id = COALESCE(NEW.id_agente, NEW.id_cliente);

  -- 1) Asignación / reasignación (si cambia id_agente)
  IF (NOT (OLD.id_agente <=> NEW.id_agente)) THEN
    IF (OLD.id_agente IS NULL AND NEW.id_agente IS NOT NULL) THEN
      INSERT INTO historial_actividad (
        id_ticket,
        id_usuario,
        accion,
        valor_anterior,
        valor_nuevo,
        fecha_evento
      ) VALUES (
        NEW.id_ticket,
        v_actor_id,
        'ASIGNADO',
        NULL,
        CAST(NEW.id_agente AS CHAR),
        NOW()
      );
    ELSEIF (OLD.id_agente IS NOT NULL AND NEW.id_agente IS NOT NULL AND OLD.id_agente <> NEW.id_agente) THEN
      INSERT INTO historial_actividad (
        id_ticket,
        id_usuario,
        accion,
        valor_anterior,
        valor_nuevo,
        fecha_evento
      ) VALUES (
        NEW.id_ticket,
        v_actor_id,
        'REASIGNADO',
        CAST(OLD.id_agente AS CHAR),
        CAST(NEW.id_agente AS CHAR),
        NOW()
      );
    END IF;

    -- Evento dominio: TICKET_ASSIGNED
    INSERT INTO eventos_dominio (
      tipo_evento,
      entidad,
      entidad_id,
      payload,
      fecha_evento
    ) VALUES (
      'TICKET_ASSIGNED',
      'tickets',
      NEW.id_ticket,
      JSON_OBJECT(
        'old_agente', OLD.id_agente,
        'new_agente', NEW.id_agente
      ),
      NOW()
    );
  END IF;

  -- 2) Cambio de estado (si cambia estado)
  IF (NOT (OLD.estado <=> NEW.estado)) THEN
    -- Historial: CAMBIO_ESTADO
    INSERT INTO historial_actividad (
      id_ticket,
      id_usuario,
      accion,
      valor_anterior,
      valor_nuevo,
      fecha_evento
    ) VALUES (
      NEW.id_ticket,
      v_actor_id,
      'CAMBIO_ESTADO',
      OLD.estado,
      NEW.estado,
      NOW()
    );

    -- Historial: CIERRE (si llega a CLOSED)
    IF (NEW.estado = 'CLOSED') THEN
      INSERT INTO historial_actividad (
        id_ticket,
        id_usuario,
        accion,
        valor_anterior,
        valor_nuevo,
        fecha_evento
      ) VALUES (
        NEW.id_ticket,
        v_actor_id,
        'CIERRE',
        OLD.estado,
        NEW.estado,
        NOW()
      );
    END IF;

    -- Evento dominio: TICKET_STATUS_CHANGED
    INSERT INTO eventos_dominio (
      tipo_evento,
      entidad,
      entidad_id,
      payload,
      fecha_evento
    ) VALUES (
      'TICKET_STATUS_CHANGED',
      'tickets',
      NEW.id_ticket,
      JSON_OBJECT(
        'old_estado', OLD.estado,
        'new_estado', NEW.estado
      ),
      NOW()
    );
  END IF;
END
`);

    // comentarios: AFTER INSERT
    await queryRunner.query(`
CREATE TRIGGER trg_comentarios_ai_audit
AFTER INSERT ON comentarios
FOR EACH ROW
BEGIN
  INSERT INTO historial_actividad (
    id_ticket,
    id_usuario,
    accion,
    valor_anterior,
    valor_nuevo,
    fecha_evento
  ) VALUES (
    NEW.id_ticket,
    NEW.id_usuario,
    'COMENTARIO',
    NULL,
    CAST(NEW.id_comentario AS CHAR),
    NOW()
  );
END
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Orden seguro: drop triggers si existen.
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_comentarios_ai_audit');
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_tickets_au_audit');
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_tickets_ai_audit');
  }
}
