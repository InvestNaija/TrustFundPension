import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateNotificationsTable1936892715748 implements MigrationInterface {
  private tableName = 'notifications';

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
              name: 'title',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'body',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'type',
              type: 'enum',
              enum: ['SYSTEM', 'TRANSACTION', 'SECURITY', 'MARKETING'],
              default: "'SYSTEM'",
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['PENDING', 'SENT', 'FAILED'],
              default: "'PENDING'",
              isNullable: false,
            },
            {
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'fcm_token',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'is_read',
              type: 'boolean',
              default: false,
              isNullable: false,
            },
            {
              name: 'data',
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

      // Add foreign key constraint
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