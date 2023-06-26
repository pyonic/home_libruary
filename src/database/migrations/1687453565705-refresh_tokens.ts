import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class RefreshTokens1687453565705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'refresh_tokens',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'token',
                    type: 'varchar',
                },
                {
                    name: 'login',
                    type: 'varchar',
                    isPrimary: true
                },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('refresh_tokens');
      }

}
