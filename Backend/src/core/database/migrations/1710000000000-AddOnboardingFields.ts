import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnboardingFields1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN onboarding_date TIMESTAMPTZ NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN is_onboarded,
      DROP COLUMN onboarding_date;
    `);
  }
} 