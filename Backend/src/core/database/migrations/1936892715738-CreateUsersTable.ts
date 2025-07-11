import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ACCOUNT_TYPE } from '../../constants';

export class CreateUsersTable1936892715738 implements MigrationInterface {
  private tableName = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable(this.tableName);

    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: this.tableName,
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'gen_random_uuid()',
            },
            {
              name: 'bvn',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'nin',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'pen',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'first_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'middle_name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'last_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'dob',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'gender',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'phone',
              type: 'varchar',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'uuid_token',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'ref_code',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'referrer',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'show_balance',
              type: 'boolean',
              default: true,
            },
            {
              name: 'state_of_posting',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'lga_of_posting',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'is_enabled',
              type: 'boolean',
              default: true,
            },
            {
              name: 'is_locked',
              type: 'boolean',
              default: false,
            },
            {
              name: 'first_login',
              type: 'boolean',
              default: true,
            },
            {
              name: 'two_factor_auth',
              type: 'boolean',
              default: false,
            },
            {
              name: 'account_type',
              type: 'enum',
              enum: Object.values(ACCOUNT_TYPE),
              isNullable: true,
            },
            {
              name: 'otp_code_hash',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'otp_code_expiry',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'is_email_verified',
              type: 'boolean',
              default: false,
            },
            {
              name: 'is_phone_verified',
              type: 'boolean',
              default: false,
            },
            {
              name: 'password_changed_at',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'is_onboarded',
              type: 'boolean',
              default: false,
            },
            {
              name: 'onboarding_date',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'fcm_token',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamptz',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'deleted_at',
              type: 'timestamptz',
              isNullable: true,
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
} 