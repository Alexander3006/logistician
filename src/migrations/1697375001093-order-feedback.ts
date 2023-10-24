import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderFeedback1697375001093 implements MigrationInterface {
  name = 'OrderFeedback1697375001093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "comment" character varying(511), "rating" integer NOT NULL, "customer_id" uuid, "executor_id" uuid NOT NULL, "order_id" uuid NOT NULL, CONSTRAINT "CHK_31d32649e839114b18a1dcab37" CHECK ("rating" <= 10), CONSTRAINT "CHK_49d14ada47928a243ccd21fe7a" CHECK ("rating" >= 0), CONSTRAINT "PK_7b0f134f6a9d3b8ae0af2fd84a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" ADD CONSTRAINT "FK_1bad2136cbac6d036341c028d7d" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" ADD CONSTRAINT "FK_f083f1bad66b394e8e2ac192e29" FOREIGN KEY ("executor_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" ADD CONSTRAINT "FK_0db9cd329642607839eaac7913b" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_feedback" DROP CONSTRAINT "FK_0db9cd329642607839eaac7913b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" DROP CONSTRAINT "FK_f083f1bad66b394e8e2ac192e29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" DROP CONSTRAINT "FK_1bad2136cbac6d036341c028d7d"`,
    );
    await queryRunner.query(`DROP TABLE "order_feedback"`);
  }
}
