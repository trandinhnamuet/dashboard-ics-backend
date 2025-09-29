import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateImagesTable1727520000000 implements MigrationInterface {
  name = 'CreateImagesTable1727520000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create dashboard schema if it doesn't exist
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "dashboard"`);

    // Create images table in dashboard schema
    await queryRunner.createTable(
      new Table({
        schema: 'dashboard',
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'filename',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'original_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'size',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'path',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_IMAGES_FILENAME',
            columnNames: ['filename'],
          },
          {
            name: 'IDX_IMAGES_CREATED_AT',
            columnNames: ['created_at'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dashboard.images');
  }
}