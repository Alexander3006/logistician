import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cars1692014992561 implements MigrationInterface {
  name = 'Cars1692014992561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cargo_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_e42913a9912a4acf9bb459a1114" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" character varying(255) NOT NULL, "owner_id" uuid NOT NULL, "driver_id" uuid, "cargo_type_id" character varying NOT NULL, "load_capacity" integer NOT NULL, "volume" integer NOT NULL, "verified" boolean NOT NULL DEFAULT false, "type_id" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_0fb8ff3175d6e5ee61d00424c74" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_5d016d57dba1066f52fc3a1d2f2" FOREIGN KEY ("driver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_7bfbb82e6b89e82079a62290ff6" FOREIGN KEY ("type_id") REFERENCES "cargo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_7bfbb82e6b89e82079a62290ff6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_5d016d57dba1066f52fc3a1d2f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_0fb8ff3175d6e5ee61d00424c74"`,
    );
    await queryRunner.query(`DROP TABLE "car"`);
    await queryRunner.query(`DROP TABLE "cargo_type"`);
  }
}
