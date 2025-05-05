import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeBvnNinRsaPinNullable1936892715746 implements MigrationInterface {
    private tableName = 'trustfund.users';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE ${this.tableName}
            ALTER COLUMN bvn DROP NOT NULL,
            ALTER COLUMN nin DROP NOT NULL,
            ALTER COLUMN rsa_pin DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE ${this.tableName}
            ALTER COLUMN bvn SET NOT NULL,
            ALTER COLUMN nin SET NOT NULL,
            ALTER COLUMN rsa_pin SET NOT NULL
        `);
    }
} 