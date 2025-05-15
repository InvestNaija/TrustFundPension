import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateContactUsTable1936892715741 implements MigrationInterface {
  private tableName = 'contact_us';

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
              name: 'name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'phone',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'subject',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'message',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'response',
              type: 'text',
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