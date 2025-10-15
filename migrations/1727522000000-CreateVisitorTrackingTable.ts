import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVisitorTrackingTable1727522000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Đảm bảo schema 'dashboard' tồn tại
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS dashboard`);
    await queryRunner.createTable(
      new Table({
        name: 'dashboard.visitor_tracking',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'access_count',
            type: 'int',
            default: 1,
          },
          {
            name: 'page_count',
            type: 'int',
            default: 1,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        schema: 'dashboard',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dashboard.visitor_tracking');
  }
}