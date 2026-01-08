# Base de datos y persistencia

## Fuente de verdad (DDL)

El esquema oficial está en:

- [database/ddl_gestion_tickets.sql](../database/ddl_gestion_tickets.sql)

Características del DDL:

- MariaDB/MySQL
- InnoDB
- `utf8mb4_unicode_ci`
- IDs `INT AUTO_INCREMENT`
- Enums estrictos:
  - `tickets.estado`: `OPEN | IN_PROGRESS | CLOSED`
  - `tickets.prioridad`: `LOW | MEDIUM | HIGH`
  - `usuarios.estado`: `ACTIVO | INACTIVO`
  - `historial_actividad.accion`: `CREADO | ASIGNADO | REASIGNADO | CAMBIO_ESTADO | COMENTARIO | CIERRE`
  - `notificaciones.tipo`: `EMAIL | WEBSOCKET | LOG`
  - `eventos_dominio.tipo_evento`: `TICKET_CREATED | TICKET_ASSIGNED | TICKET_STATUS_CHANGED`

## Modelo relacional (ERD)

```mermaid
erDiagram
  USUARIOS {
    int id_usuario PK
    varchar nombre
    varchar email
    varchar password_hash
    enum estado
    timestamp fecha_creacion
  }

  ROLES {
    int id_rol PK
    varchar nombre
    varchar descripcion
  }

  USUARIO_ROL {
    int id_usuario PK, FK
    int id_rol PK, FK
  }

  TICKETS {
    int id_ticket PK
    varchar titulo
    text descripcion
    enum estado
    enum prioridad
    int id_cliente FK
    int id_agente FK
    timestamp fecha_creacion
    timestamp fecha_actualizacion
    timestamp fecha_cierre
  }

  COMENTARIOS {
    int id_comentario PK
    int id_ticket FK
    int id_usuario FK
    text contenido
    timestamp fecha_creacion
  }

  ADJUNTOS {
    int id_adjunto PK
    int id_ticket FK
    int id_comentario FK
    varchar nombre_archivo
    varchar tipo_archivo
    varchar ruta
    timestamp fecha_subida
  }

  HISTORIAL_ACTIVIDAD {
    int id_historial PK
    int id_ticket FK
    int id_usuario FK
    enum accion
    varchar valor_anterior
    varchar valor_nuevo
    timestamp fecha_evento
  }

  NOTIFICACIONES {
    int id_notificacion PK
    int id_usuario FK
    enum tipo
    varchar mensaje
    tinyint leida
    timestamp fecha_envio
  }

  EVENTOS_DOMINIO {
    int id_evento PK
    enum tipo_evento
    varchar entidad
    int entidad_id
    longtext payload
    timestamp fecha_evento
  }

  USUARIOS ||--o{ TICKETS : "cliente"
  USUARIOS ||--o{ TICKETS : "agente"
  TICKETS ||--o{ COMENTARIOS : "tiene"
  USUARIOS ||--o{ COMENTARIOS : "escribe"
  TICKETS ||--o{ ADJUNTOS : "tiene"
  COMENTARIOS ||--o{ ADJUNTOS : "tiene"
  TICKETS ||--o{ HISTORIAL_ACTIVIDAD : "registra"
  USUARIOS ||--o{ HISTORIAL_ACTIVIDAD : "realiza"
  USUARIOS ||--o{ NOTIFICACIONES : "recibe"
  USUARIOS ||--o{ USUARIO_ROL : "mapea"
  ROLES ||--o{ USUARIO_ROL : "mapea"
```

## Implementación en código

### Entidades ORM (TypeORM)

Ubicación:

- [src/infra/database/typeorm/entities](../src/infra/database/typeorm/entities)

Principios:

- Las entidades ORM reflejan nombres/columnas del DDL (`id_ticket`, `id_usuario`, etc.).
- El dominio no conoce TypeORM.

### Repositorios MySQL (TypeORM)

Ubicación:

- [src/infra/database/typeorm/repositories](../src/infra/database/typeorm/repositories)

Estos repositorios implementan los puertos de:

- [src/interfaces/repositories](../src/interfaces/repositories)

### Selección del driver (in-memory vs mysql)

La selección se hace con `PERSISTENCE_DRIVER` en:

- [src/infrastructure/persistence/persistence.module.ts](../src/infrastructure/persistence/persistence.module.ts)

Valores:

- `in-memory` (por defecto)
- `mysql`

## Migraciones

Este proyecto usa TypeORM **solo en infraestructura** para dos cosas:

1) Mapear entidades/repositorios MySQL
2) Ejecutar migraciones versionadas (principalmente triggers de auditoría)

Los scripts TypeORM están en `package.json`:

- `npm run migration:run`
- `npm run migration:revert`
- `npm run migration:generate`

El DataSource para CLI:

- [src/infra/database/typeorm/typeorm.datasource.ts](../src/infra/database/typeorm/typeorm.datasource.ts)

> Nota: el **DDL** crea tablas. Las **migraciones TypeORM** se usan para cambios incrementales (por ejemplo, triggers) con rollback.

## Triggers (auditoría)

Objetivo (diseño):

- Insertar filas en `historial_actividad` y `eventos_dominio` ante:
  - creación de ticket
  - asignación/reasignación
  - cambio de estado

Estrategia recomendada:

- Aplicar el DDL como “baseline” (manual o por pipeline): [../database/ddl_gestion_tickets.sql](../database/ddl_gestion_tickets.sql)
- Ejecutar migraciones TypeORM del proyecto (crean/borran triggers):
  - [../src/infra/database/typeorm/migrations/1700000000000-baseline-ddl.ts](../src/infra/database/typeorm/migrations/1700000000000-baseline-ddl.ts)
  - [../src/infra/database/typeorm/migrations/1700000000100-audit-triggers.ts](../src/infra/database/typeorm/migrations/1700000000100-audit-triggers.ts)

### Setup sugerido (MySQL/MariaDB)

1) Crear la base `ticketing_system` y aplicar el DDL.
2) Configurar `.env` (ver [../.env.example](../.env.example)) y usar `PERSISTENCE_DRIVER=mysql`.
3) Ejecutar:

```bash
npm run migration:run
```

### Verificación rápida (auditoría)

Después de crear/actualizar tickets y agregar comentarios, valida que se inserten filas:

> Si quieres una verificación “copiar/pegar”, usa el script: [../scripts/verify_audit.sql](../scripts/verify_audit.sql)

```sql
SELECT *
FROM historial_actividad
ORDER BY fecha_evento DESC
LIMIT 50;

SELECT *
FROM eventos_dominio
ORDER BY fecha_evento DESC
LIMIT 50;
```

Si quieres inspeccionar triggers instalados:

```sql
SHOW TRIGGERS LIKE 'tickets';
SHOW TRIGGERS LIKE 'comentarios';
```

## Checklist ejecutable (MySQL real)

### 0) Prerrequisitos

- MySQL/MariaDB levantado (XAMPP sirve)
- Base creada: `ticketing_system`

### 1) Aplicar DDL (tablas)

El DDL es la fuente de verdad:

- [../database/ddl_gestion_tickets.sql](../database/ddl_gestion_tickets.sql)

Aplica el script en tu cliente (phpMyAdmin o CLI). En CLI, un ejemplo típico:

```bash
mysql -u root -p ticketing_system < database/ddl_gestion_tickets.sql
```

### 2) Configurar el proyecto para MySQL

Usa `.env` basado en:

- [../.env.example](../.env.example)

O exporta variables en PowerShell:

```powershell
$env:PERSISTENCE_DRIVER = "mysql"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = ""
$env:DB_NAME = "ticketing_system"
$env:JWT_SECRET = "dev_secret_change_me"
```

### 3) Ejecutar migraciones (triggers)

```bash
npm run migration:run
```

Para revertir:

```bash
npm run migration:revert
```

### 4) Ejecutar la API contra MySQL

```bash
npm run start:dev
```

### 5) Probar flujo mínimo vía API

Usa Swagger (`/api/docs`) o llamadas HTTP.

Flujo sugerido:

1) Crear 2 usuarios (cliente + agente) y obtener token (login)
2) Crear ticket como cliente
3) Asignar ticket al agente (admin o agente según reglas)
4) Cambiar estado (IN_PROGRESS, luego CLOSED)
5) Crear comentario

### 6) Verificar auditoría en DB

Ejecuta:

```sql
SOURCE scripts/verify_audit.sql;
```

O copia/pega consultas:

```sql
SELECT id_ticket, accion, id_usuario, valor_anterior, valor_nuevo, fecha_evento
FROM historial_actividad
ORDER BY fecha_evento DESC
LIMIT 50;

SELECT tipo_evento, entidad, entidad_id, fecha_evento
FROM eventos_dominio
ORDER BY fecha_evento DESC
LIMIT 50;
```

