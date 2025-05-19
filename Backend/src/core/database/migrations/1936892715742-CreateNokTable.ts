import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateNokTable1936892715742 implements MigrationInterface {
  private tableName = 'noks';

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
              isNullable: false,
            },
            {
              name: 'first_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'other_name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'surname',
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

      await queryRunner.createForeignKey(
        this.tableName,
        new TableForeignKey({
          columnNames: ['userId'],
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