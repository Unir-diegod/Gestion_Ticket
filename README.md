# Sistema de Gestión de Tickets — API (NestJS)

API construida con **NestJS + TypeScript** aplicando **Clean Architecture / Hexagonal (DDD ligero)**.

## Documentación (técnica)

- Índice y guías: [docs/README.md](docs/README.md)
- Arquitectura (diagramas Mermaid): [docs/architecture.md](docs/architecture.md)
- Base de datos y persistencia (DDL/TypeORM/migraciones): [docs/database.md](docs/database.md)
- Ejecución y desarrollo: [docs/running.md](docs/running.md)

## Stack

- **NestJS** (módulos, DI)
- **Swagger**: `http://localhost:3000/api/docs`
- **Auth**: JWT + Passport
- **RBAC**: ADMIN / AGENT / CLIENT
- **Eventos internos**: `@nestjs/event-emitter`
- **WebSockets**: Socket.IO (`/notifications`)
- **Persistencia**: `in-memory` (default) o `mysql` (TypeORM, solo infraestructura)
- **DB**: MySQL/MariaDB (esquema real en DDL)

## Arquitectura (resumen)

- `src/domain/**`: dominio puro (entidades, value objects, eventos)
- `src/interfaces/**`: puertos (contratos de repos)
- `src/modules/**`: delivery + aplicación (controllers/services)
- `src/infra/database/typeorm/**`: adaptadores MySQL (entidades ORM, mappers, repos, migraciones)
- `src/infrastructure/persistence/**`: switch de driver (`PERSISTENCE_DRIVER`)

## Quickstart (in-memory)

```bash
npm install
npm run start:dev
```

- Swagger: `http://localhost:3000/api/docs`

## Configuración (.env)

Hay un ejemplo en `.env.example`. En PowerShell puedes exportar variables con `$env:...`.

Variables clave:

- `PORT` (default 3000)
- `JWT_SECRET`
- `PERSISTENCE_DRIVER` (`in-memory` | `mysql`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Base de datos (DDL)

El esquema oficial (fuente de verdad) está en:

- [database/ddl_gestion_tickets.sql](database/ddl_gestion_tickets.sql)

Importante:

- Las tablas se crean desde el **DDL**.
- Las **migraciones TypeORM** del proyecto se usan para versionar **triggers de auditoría** (y otros cambios incrementales).

## Migraciones (TypeORM)

DataSource CLI:

- [src/infra/database/typeorm/typeorm.datasource.ts](src/infra/database/typeorm/typeorm.datasource.ts)

Scripts:

- `npm run migration:run`
- `npm run migration:revert`

## Auditoría (triggers)

Con `PERSISTENCE_DRIVER=mysql` y tras correr migraciones, la DB crea triggers que insertan en:

- `historial_actividad`
- `eventos_dominio`

Guía y verificación: [docs/database.md](docs/database.md)

## Scripts útiles

- Build: `npm run build`
- Lint: `npm run lint`
- Tests: `npm run test`
- E2E: `npm run test:e2e`

## Estructura del repo

```text
database/                 (DDL fuente de verdad)
docs/                     (documentación técnica)
src/
  domain/                 (puro)
  interfaces/             (puertos)
  modules/                (Nest modules)
  infra/database/typeorm/ (ORM + repos + migraciones)
  infrastructure/persistence/ (driver switch)
test/                     (e2e)
```

