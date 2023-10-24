import { MigrationInterface, QueryRunner } from 'typeorm';

export class Verification1693501751922 implements MigrationInterface {
  name = 'Verification1693501751922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_decdf86f650fb765dac7bd091a6"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documents_type_enum" AS ENUM('PASSPORT', 'DRIVER_LICENSE', 'REGISTRATION_CERTIFICATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "key" character varying NOT NULL, "mimetype" character varying NOT NULL, "type" "public"."documents_type_enum" NOT NULL, "user_id" uuid, "car_id" uuid, CONSTRAINT "UQ_83d027685515d639dc1a2ff4afc" UNIQUE ("key"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."balance_history_type_enum" AS ENUM('Deposit', 'Withdraw')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."balance_history_status_enum" AS ENUM('PENDING', 'CANCELLED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."balance_history_type_enum" NOT NULL, "status" "public"."balance_history_status_enum" NOT NULL, "in_amount" numeric(30,18) NOT NULL DEFAULT '0', "out_amount" numeric(30,18) NOT NULL DEFAULT '0', "fee_amount" numeric(30,18) NOT NULL DEFAULT '0', "in_currency_id" uuid, "out_currency_id" uuid, "fee_currency_id" uuid, "user_id" uuid NOT NULL, CONSTRAINT "PK_dc0b0a31a6896d2e4fd3f08042c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."verification_status_enum" AS ENUM('PENDING', 'REJECTED', 'APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."verification_type_enum" AS ENUM('USER', 'CAR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."verification_status_enum" NOT NULL DEFAULT 'PENDING', "response" character varying NOT NULL, "description" character varying NOT NULL, "owner_id" uuid, "type" "public"."verification_type_enum" NOT NULL, "user_id" uuid, "car_id" uuid, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_decdf86f650fb765dac7bd091a6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_123df3359658f3f34fd898b96ab" FOREIGN KEY ("car_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ADD CONSTRAINT "FK_89df318a1cb876bc5081e85cc36" FOREIGN KEY ("in_currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ADD CONSTRAINT "FK_0089d0e29a36f6ded02026d0b16" FOREIGN KEY ("out_currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ADD CONSTRAINT "FK_618a5065680c6b689d7702f156f" FOREIGN KEY ("fee_currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ADD CONSTRAINT "FK_0a1b904300675176db553c4cb96" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_3fc22ed68c8e719351597ef4730" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_49cf5e171603b309b4194850461" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_25d2f16312061d482c71d9b0c4a" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_25d2f16312061d482c71d9b0c4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_49cf5e171603b309b4194850461"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_3fc22ed68c8e719351597ef4730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" DROP CONSTRAINT "FK_0a1b904300675176db553c4cb96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" DROP CONSTRAINT "FK_618a5065680c6b689d7702f156f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" DROP CONSTRAINT "FK_0089d0e29a36f6ded02026d0b16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" DROP CONSTRAINT "FK_89df318a1cb876bc5081e85cc36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_123df3359658f3f34fd898b96ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_decdf86f650fb765dac7bd091a6"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verified"`);
    await queryRunner.query(`DROP TABLE "verification"`);
    await queryRunner.query(`DROP TYPE "public"."verification_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."verification_status_enum"`);
    await queryRunner.query(`DROP TABLE "balance_history"`);
    await queryRunner.query(`DROP TYPE "public"."balance_history_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."balance_history_type_enum"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TYPE "public"."documents_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_decdf86f650fb765dac7bd091a6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
