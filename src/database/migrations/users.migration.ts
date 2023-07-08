import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1633023051541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'login',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'version',
            type: 'integer',
            isNullable: true,
            default: 1,
          },
          {
            name: 'createdAt',
            type: 'bigint',
            isNullable: true,
            default: 'EXTRACT(epoch FROM NOW())::bigint',
          },
          {
            name: 'updatedAt',
            type: 'bigint',
            isNullable: true,
            default: 'EXTRACT(epoch FROM NOW())::bigint',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
