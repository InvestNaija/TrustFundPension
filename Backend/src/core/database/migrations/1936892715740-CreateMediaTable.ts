import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMediaTable1936892715740 implements MigrationInterface {
  private tableName = 'media';

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
              name: 'userId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'upload_type',
              type: 'enum',
              enum: ['PROFILE_PICTURE', 'DOCUMENT', 'OTHER'],
              isNullable: false,
            },
            {
              name: 'file_url',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'file_type',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'file_size',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'tags',
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