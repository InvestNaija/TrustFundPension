import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAddressesTable1936892715747 implements MigrationInterface {
  private tableName = 'addresses';

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
              name: 'house_number',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'street_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'city',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'state',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'lga_code',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'zip_code',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'country_code',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'common_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'common_type',
              type: 'varchar',
              isNullable: false,
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