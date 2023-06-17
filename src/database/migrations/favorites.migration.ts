import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateFavoritesTable1633023265957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "favorites",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "artists",
            type: "uuid",
            isArray: true,
            default: "array[]::uuid[]",
          },
          {
            name: "albums",
            type: "uuid",
            isArray: true,
            default: "array[]::uuid[]",
          },
          {
            name: "tracks",
            type: "uuid",
            isArray: true,
            default: "array[]::uuid[]",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("favorites");
  }
}
