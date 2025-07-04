import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRoleTable1718400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_role" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_user_role" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_role_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_role_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_role";`);
  }
} 