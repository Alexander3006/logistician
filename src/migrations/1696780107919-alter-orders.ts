import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOrders1696780107919 implements MigrationInterface {
  name = 'AlterOrders1696780107919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "CHK_45e2fef6d05b52bacd7fc48958"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."balance_payment_status_enum" AS ENUM('PENDING', 'CANCELLED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sender_balance_history_id" uuid NOT NULL, "recipient_balance_history_id" uuid NOT NULL, "status" "public"."balance_payment_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_944ada1e56b623c25306688a0b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "images" ADD "car_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "insurance_amount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "balance_payment_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "balance_compensation_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" ADD "insurance_amount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" ADD "status" character varying NOT NULL DEFAULT 'CREATED'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."balance_history_type_enum" RENAME TO "balance_history_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."balance_history_type_enum" AS ENUM('Deposit', 'Withdraw', 'Payment')`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ALTER COLUMN "type" TYPE "public"."balance_history_type_enum" USING "type"::"text"::"public"."balance_history_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."balance_history_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_9e4793b58311a81ed09fe34098a" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_payment" ADD CONSTRAINT "FK_67588a0e642bd7b1c7e8e7f35db" FOREIGN KEY ("sender_balance_history_id") REFERENCES "balance_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_payment" ADD CONSTRAINT "FK_17b687e19e606fd5fc8323af6d4" FOREIGN KEY ("recipient_balance_history_id") REFERENCES "balance_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_5aee5d0cff5e803f94fad3a9a28" FOREIGN KEY ("balance_payment_id") REFERENCES "balance_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_1736e981093df2a40cbfbcfee8b" FOREIGN KEY ("balance_compensation_id") REFERENCES "balance_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_1736e981093df2a40cbfbcfee8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_5aee5d0cff5e803f94fad3a9a28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_payment" DROP CONSTRAINT "FK_17b687e19e606fd5fc8323af6d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_payment" DROP CONSTRAINT "FK_67588a0e642bd7b1c7e8e7f35db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_9e4793b58311a81ed09fe34098a"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."balance_history_type_enum_old" AS ENUM('Deposit', 'Withdraw')`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ALTER COLUMN "type" TYPE "public"."balance_history_type_enum_old" USING "type"::"text"::"public"."balance_history_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."balance_history_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."balance_history_type_enum_old" RENAME TO "balance_history_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "order_request" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "order_request" DROP COLUMN "insurance_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "balance_compensation_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "balance_payment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "insurance_amount"`,
    );
    await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "car_id"`);
    await queryRunner.query(`DROP TABLE "balance_payment"`);
    await queryRunner.query(`DROP TYPE "public"."balance_payment_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "CHK_45e2fef6d05b52bacd7fc48958" CHECK ((balance >= (0)::numeric))`,
    );
  }
}
