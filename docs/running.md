# Ejecución y desarrollo

## Requisitos

- Node.js (LTS recomendado)
- npm
- Opcional (para `mysql`): MySQL/MariaDB (p.ej. XAMPP)

## Instalación

```bash
npm install
```

## Variables de entorno

Se validan en:

- [src/config/env.validation.ts](../src/config/env.validation.ts)

Principales:

- `PORT` (default 3000)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PERSISTENCE_DRIVER` (`in-memory` | `mysql`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_LOGGING`

Ejemplo (PowerShell):

```powershell
$env:PERSISTENCE_DRIVER = "mysql"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = ""
$env:DB_NAME = "ticketing_system"
$env:JWT_SECRET = "dev_secret_change_me"
```

## Correr el proyecto

- Dev:

```bash
npm run start:dev
```

- Producción:

```bash
npm run build
npm run start:prod
```

## Swagger

- `http://localhost:3000/api/docs`

## WebSockets

- Gateway en `NotificationsModule` (usa Socket.IO).
- Se emiten mensajes cuando ocurren eventos de tickets.

## Scripts útiles

- Lint: `npm run lint`
- Formato: `npm run format`
- Tests: `npm run test`

## Migraciones (MySQL)

- Ejecutar: `npm run migration:run`
- Revertir: `npm run migration:revert`

## Troubleshooting

- Si `PERSISTENCE_DRIVER=mysql` y falla conexión:
  - revisa `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`
  - confirma que la DB existe y el DDL fue aplicado
- Si Swagger no carga:
  - confirma que el server corre en `PORT`

