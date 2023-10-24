import { MigrationInterface, QueryRunner } from 'typeorm';

export class Location1697382175040 implements MigrationInterface {
  name = 'Location1697382175040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequence_id" SERIAL NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "coordinates" geography(Point,4326) NOT NULL, "user_id" uuid, "car_id" uuid, "order_id" uuid, CONSTRAINT "UQ_ba3b695bc9d4bd35cc12839507f" UNIQUE ("user_id"), CONSTRAINT "UQ_4ee4e0b6ecfa507cf11932d2795" UNIQUE ("car_id"), CONSTRAINT "UQ_6de11c66ca73e139f09b0b82b86" UNIQUE ("order_id"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39873ca558965503fff41dc89c" ON "location" USING GiST ("coordinates") `,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_ba3b695bc9d4bd35cc12839507f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_4ee4e0b6ecfa507cf11932d2795" FOREIGN KEY ("car_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_6de11c66ca73e139f09b0b82b86" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_6de11c66ca73e139f09b0b82b86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_4ee4e0b6ecfa507cf11932d2795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_ba3b695bc9d4bd35cc12839507f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39873ca558965503fff41dc89c"`,
    );
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
