import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773994015186 implements MigrationInterface {
    name = 'InitialSchema1773994015186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ping" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, CONSTRAINT "PK_b01cab9d614b77bac5973937663" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ping"`);
    }
}
