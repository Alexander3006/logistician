import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPhoneNickname1696780870323 implements MigrationInterface {
  name = 'UserPhoneNickname1696780870323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phone" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname")`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
  }
}
