import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRoleFromUsersTable1936892715744 implements MigrationInterface {
  private tableName = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, 'role');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ${this.tableName}
      ADD COLUMN role VARCHAR NOT NULL DEFAULT 'CLIENT'
    `);
  }
} 