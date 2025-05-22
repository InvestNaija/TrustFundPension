import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateFundTransfersTable1936892715747 implements MigrationInterface {
  private tableName = 'fund_transfers';

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
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'current_fund',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'aspiring_fund',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'is_approved',
              type: 'boolean',
              default: false,
            },
            {
              name: 'approval_date',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'rejection_reason',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamptz',
              default: 'now()',
              onUpdate: 'now()',
            },
            {
              name: 'deleted_at',
              type: 'timestamptz',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        this.tableName,
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
} 