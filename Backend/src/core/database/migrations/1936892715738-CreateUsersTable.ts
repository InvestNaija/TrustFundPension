import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { USER_ROLE } from '../../constants';

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
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'bvn',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'nin',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'rsa_pin',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'first_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'middle_name',
              type: 'varchar',
              isNullable: false,
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
              default: false,
            },
            {
              name: 'state_of_posting',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'lga_of_posting',
              type: 'varchar',
              isNullable: true,
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
              name: 'role',
              type: 'enum',
              enum: Object.values(USER_ROLE),
              isNullable: false,
            },
            {
              name: 'otpCodeHash',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'otpCodeExpiry',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'isEmailVerified',
              type: 'boolean',
              default: false,
            },
            {
              name: 'passwordChangedAt',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamptz',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamptz',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'deletedAt',
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