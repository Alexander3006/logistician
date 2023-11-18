import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addresses1700335295218 implements MigrationInterface {
  name = 'Addresses1700335295218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" uuid, "country" character varying(255), "region" character varying(255), "city" character varying(255), "address" character varying(255), "description" character varying(255), CONSTRAINT "UQ_fd2e3422993fd79f9afd7485a0f" UNIQUE ("sequence_id"), CONSTRAINT "UQ_db1f6f506684c26b3f424296829" UNIQUE ("order_id"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "location"`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD "description" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" ADD CONSTRAINT "UQ_9bcc6875f79172c206a6d305181" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_session" ADD CONSTRAINT "UQ_bcb47cea3372fdbdb21613ee8de" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "UQ_06986543c26ab9924994692b3d8" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cargo_type" ADD CONSTRAINT "UQ_622e9ebee8aa727fad6990c2e9a" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" ADD CONSTRAINT "UQ_33f1af3d4e97b4620985dd2ab15" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_payment" ADD CONSTRAINT "UQ_d44ea859ca13f7251833c6a98d2" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_b2d8fd7ec8fae664fee7a7fe10e" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "UQ_72ecb682cc85147d768aa10afa0" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "UQ_b30a58f9d8840c8c5e7b549bfad" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "UQ_859cc9ec6997004d38e760d272a" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_ac645d11089ee46c00852f8e81e" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ADD CONSTRAINT "UQ_c5d768f675978f88a436a9ecceb" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" ADD CONSTRAINT "UQ_7bca295a6ad8e77e564c912f952" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_223824640836ab3699140fa02b7" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "UQ_eb41cdc8e969ae0f1194d3af491" UNIQUE ("sequence_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_db1f6f506684c26b3f424296829" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_db1f6f506684c26b3f424296829"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "UQ_eb41cdc8e969ae0f1194d3af491"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_223824640836ab3699140fa02b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_feedback" DROP CONSTRAINT "UQ_7bca295a6ad8e77e564c912f952"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" DROP CONSTRAINT "UQ_c5d768f675978f88a436a9ecceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_ac645d11089ee46c00852f8e81e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "UQ_859cc9ec6997004d38e760d272a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "UQ_b30a58f9d8840c8c5e7b549bfad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "UQ_72ecb682cc85147d768aa10afa0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_b2d8fd7ec8fae664fee7a7fe10e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_payment" DROP CONSTRAINT "UQ_d44ea859ca13f7251833c6a98d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" DROP CONSTRAINT "UQ_33f1af3d4e97b4620985dd2ab15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cargo_type" DROP CONSTRAINT "UQ_622e9ebee8aa727fad6990c2e9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "UQ_06986543c26ab9924994692b3d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_session" DROP CONSTRAINT "UQ_bcb47cea3372fdbdb21613ee8de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" DROP CONSTRAINT "UQ_9bcc6875f79172c206a6d305181"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "location" character varying(255)`,
    );
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
