import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrdersCurrency1692019379277 implements MigrationInterface {
  name = 'OrdersCurrency1692019379277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "ticker" character varying NOT NULL, "title" character varying NOT NULL, "precision" integer NOT NULL, CONSTRAINT "UQ_d617ea51cf66761ffd3d1f23e34" UNIQUE ("ticker"), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "currency_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_9f2e0cea99cf824bd2a53a21aff" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_9f2e0cea99cf824bd2a53a21aff"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "currency_id"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "date"`);
    await queryRunner.query(`DROP TABLE "currency"`);
  }
}
