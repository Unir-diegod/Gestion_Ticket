import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Este DataSource se usa para el CLI de TypeORM (migraciones/queries).
  // No necesita cargar entidades (evita problemas de resolución ESM en Windows).
  entities: [],
  migrations: ['src/infra/database/typeorm/migrations/*.{ts,cts}'],
  synchronize: false,
});
