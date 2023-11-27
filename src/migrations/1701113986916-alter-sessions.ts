import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSessions1701113986916 implements MigrationInterface {
  name = 'AlterSessions1701113986916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_session" ADD "locale" character varying(255) DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_session" DROP COLUMN "locale"`);
  }
}
