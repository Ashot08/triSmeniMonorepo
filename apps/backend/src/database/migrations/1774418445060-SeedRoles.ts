import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRoles1774418445060 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`
            DELETE
            FROM "roles"
            WHERE "code" IN (
                             'player',
                             'subscription_owner',
                             'organization_admin',
                             'platform_admin',
                             'moderator',
                             'content_manager'
                );
        `);
    }

}
