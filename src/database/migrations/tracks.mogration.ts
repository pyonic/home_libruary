import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTrackTable1633023362793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tracks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'artistId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'albumId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'integer',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('track');
  }
}
