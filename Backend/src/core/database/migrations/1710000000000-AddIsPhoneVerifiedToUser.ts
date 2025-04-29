import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsPhoneVerifiedToUser1710000000000 implements MigrationInterface {
  name = 'AddIsPhoneVerifiedToUser1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isPhoneVerified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isPhoneVerified"`);
  }
} 