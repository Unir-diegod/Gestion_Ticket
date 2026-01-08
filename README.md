# Sistema de Gestión de Tickets (API)

API construida con NestJS + TypeScript siguiendo Clean Architecture / Hexagonal (DDD ligero).

## Documentación

- Documentación completa (arquitectura, DB, ejecución): [docs/README.md](docs/README.md)

Incluye diagramas Mermaid para facilitar la lectura.

## Características

- REST API con Swagger: `/api/docs`
- Autenticación JWT (Passport)
- RBAC (ADMIN/AGENT/CLIENT)
- Eventos internos (`@nestjs/event-emitter`) para historial y notificaciones
- WebSockets (Socket.IO) para notificaciones
- Persistencia conmutables:
  - `in-memory` (por defecto)
  - `mysql` (TypeORM en infraestructura)

## Quickstart

```bash
npm install
npm run start:dev
```

Swagger:

- `http://localhost:3000/api/docs`

## Persistencia

El esquema oficial está en:

- [database/ddl_gestion_tickets.sql](database/ddl_gestion_tickets.sql)

Configurar driver (PowerShell):

```powershell
$env:PERSISTENCE_DRIVER = "mysql"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = ""
$env:DB_NAME = "ticketing_system"
$env:JWT_SECRET = "dev_secret_change_me"
```

## Scripts

- Build: `npm run build`
- Lint: `npm run lint`
- Tests: `npm run test`
- Migraciones:
  - `npm run migration:run`
  - `npm run migration:revert`

