-- Verificación rápida de auditoría (triggers)
-- Base esperada: ticketing_system
-- Ajusta LIMIT / filtros según necesidad

SELECT 'historial_actividad (últimos 50)' AS section;
SELECT
  id_historial,
  id_ticket,
  accion,
  id_usuario,
  valor_anterior,
  valor_nuevo,
  fecha_evento
FROM historial_actividad
ORDER BY fecha_evento DESC
LIMIT 50;

SELECT 'eventos_dominio (últimos 50)' AS section;
SELECT
  id_evento,
  tipo_evento,
  entidad,
  entidad_id,
  fecha_evento,
  LEFT(payload, 500) AS payload_preview
FROM eventos_dominio
ORDER BY fecha_evento DESC
LIMIT 50;

SELECT 'triggers en tickets' AS section;
SHOW TRIGGERS LIKE 'tickets';

SELECT 'triggers en comentarios' AS section;
SHOW TRIGGERS LIKE 'comentarios';
