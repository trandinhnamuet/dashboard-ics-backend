import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateMonthlyAccessTable1727523000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "monthly_access",
                schema: "dashboard",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "month",
                        type: "varchar",
                        length: "7", // YYYY-MM format
                        isUnique: true
                    },
                    {
                        name: "access_count",
                        type: "int",
                        default: 0
                    },
                    {
                        name: "page_count",
                        type: "int",
                        default: 0
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("dashboard.monthly_access")
    }

}