import type { MigrationInterface, QueryRunner } from 'typeorm';

export class BaselineDdl1700000000000 implements MigrationInterface {
  name = 'BaselineDdl1700000000000';

  // Baseline NO-OP: marca el estado inicial del esquema.
  // Regla: NO crear/modificar tablas ni ejecutar SQL destructivo.
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
