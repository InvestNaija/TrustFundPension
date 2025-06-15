import { MigrationInterface, QueryRunner } from 'typeorm';
import { USER_ROLE } from '../core/constants';

export class CreateRolesTable1718400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" VARCHAR NOT NULL,
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      );
    `);

    // Insert default roles
    await queryRunner.query(`
      INSERT INTO "roles" ("id", "name") VALUES
      ('403e5c43-a8e1-42c4-b018-87260ce8ac1f', '${USER_ROLE.CLIENT}'),
      ('503e5c43-a8e1-42c4-b018-87260ce8ac1f', '${USER_ROLE.ADMIN}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "roles";`);
  }
} 