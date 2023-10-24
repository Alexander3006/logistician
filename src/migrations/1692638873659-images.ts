import { MigrationInterface, QueryRunner } from 'typeorm';

export class Images1692638873659 implements MigrationInterface {
  name = 'Images1692638873659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_balance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "balance" numeric NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "user_currency_uniq_index" UNIQUE ("user_id", "currency_id"), CONSTRAINT "CHK_45e2fef6d05b52bacd7fc48958" CHECK ("balance" >= 0), CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "key" character varying NOT NULL, "mimetype" character varying NOT NULL, "user_id" uuid, CONSTRAINT "UQ_b81c3bf4a0c17cf677d1d9e2abe" UNIQUE ("key"), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "FK_8fdba3bca96f8af1a318a6e25db" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "FK_a063d61d0498cd2b3c418406323" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_decdf86f650fb765dac7bd091a6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_decdf86f650fb765dac7bd091a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "FK_a063d61d0498cd2b3c418406323"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "FK_8fdba3bca96f8af1a318a6e25db"`,
    );
    await queryRunner.query(`DROP TABLE "images"`);
    await queryRunner.query(`DROP TABLE "user_balance"`);
  }
}
