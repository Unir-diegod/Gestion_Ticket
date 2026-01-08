# Documentación — Sistema de Gestión de Tickets

Esta carpeta contiene la documentación funcional y técnica del proyecto.

## Índice

- [Arquitectura](architecture.md)
- [Base de datos y persistencia](database.md)
- [Ejecución y desarrollo](running.md)

## Archivos útiles en la raíz

- Ejemplo de variables de entorno: [../.env.example](../.env.example)
- DDL (fuente de verdad): [../database/ddl_gestion_tickets.sql](../database/ddl_gestion_tickets.sql)

## Convenciones

- Los diagramas se escriben en **Mermaid** para que se rendericen en Markdown (GitHub, VS Code, etc.).
- El proyecto sigue un estilo **Clean Architecture / Hexagonal (DDD ligero)**:
  - `domain/` no depende de NestJS ni TypeORM.
  - `interfaces/` define puertos (contratos) de repositorios.
  - `infra/` y `infrastructure/` implementan adaptadores (TypeORM / in-memory).

