import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orders1692016570292 implements MigrationInterface {
  name = 'Orders1692016570292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_7bfbb82e6b89e82079a62290ff6"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" character varying(255), "location" character varying(255), "cargo_type_id" uuid NOT NULL, "price" integer NOT NULL, "volume" integer NOT NULL, "weight" integer NOT NULL, "owner_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'CREATED', "accepted_request_id" uuid, CONSTRAINT "REL_bc966907ce7d0f9ffee31e37f8" UNIQUE ("accepted_request_id"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" uuid NOT NULL, "price" integer NOT NULL, "description" character varying(255), "car_id" uuid NOT NULL, "owner_id" uuid NOT NULL, CONSTRAINT "PK_787e7fd11e2728d4b2de2c94e80" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "type_id"`);
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "cargo_type_id"`);
    await queryRunner.query(
      `ALTER TABLE "car" ADD "cargo_type_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_067025a706715f8b8caa84951db" FOREIGN KEY ("cargo_type_id") REFERENCES "cargo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_454e6825e9efaf959353b8410e6" FOREIGN KEY ("cargo_type_id") REFERENCES "cargo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_d9181c2d154dfb71af0e18d9669" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_bc966907ce7d0f9ffee31e37f84" FOREIGN KEY ("accepted_request_id") REFERENCES "order_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" ADD CONSTRAINT "FK_7e0c31737c523f19443f134412d" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" ADD CONSTRAINT "FK_6de4dbc4a4f89d5d68ef7e79b46" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" ADD CONSTRAINT "FK_70362ce8d921759462c45f59857" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_request" DROP CONSTRAINT "FK_70362ce8d921759462c45f59857"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" DROP CONSTRAINT "FK_6de4dbc4a4f89d5d68ef7e79b46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_request" DROP CONSTRAINT "FK_7e0c31737c523f19443f134412d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_bc966907ce7d0f9ffee31e37f84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_d9181c2d154dfb71af0e18d9669"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_454e6825e9efaf959353b8410e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_067025a706715f8b8caa84951db"`,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "cargo_type_id"`);
    await queryRunner.query(
      `ALTER TABLE "car" ADD "cargo_type_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "car" ADD "type_id" uuid`);
    await queryRunner.query(`DROP TABLE "order_request"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_7bfbb82e6b89e82079a62290ff6" FOREIGN KEY ("type_id") REFERENCES "cargo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
