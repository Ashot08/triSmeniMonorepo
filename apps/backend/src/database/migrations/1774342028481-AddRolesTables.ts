import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesTables1774342028481 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "roles"
        (
            "id"   uuid NOT NULL DEFAULT uuid_generate_v4(),
            "code" character varying(64)  NOT NULL,
            "name" character varying(128) NOT NULL,
            CONSTRAINT "PK_roles_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_roles_code" UNIQUE ("code")
        )
    `);

    await queryRunner.query(`
        CREATE TABLE "users_roles"
        (
            "user_id" uuid NOT NULL,
            "role_id" uuid NOT NULL,
            CONSTRAINT "PK_users_roles" PRIMARY KEY ("user_id", "role_id"),
            CONSTRAINT "FK_users_roles_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
            CONSTRAINT "FK_users_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE
        )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_user_roles_user_id" ON "users_roles" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_roles_role_id" ON "users_roles" ("role_id")`);

    // Сидим фиксированный набор ролей
    await queryRunner.query(`
        INSERT INTO "roles" ("code", "name")
        VALUES ('player', 'Игрок'),
               ('subscription_owner', 'Владелец подписки'),
               ('organization_admin', 'Администратор организации'),
               ('platform_admin', 'Администратор платформы'),
               ('moderator', 'Модератор'),
               ('content_manager', 'Контент-менеджер')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
