import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrganizationRoles1774418445061 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "organization_roles" ("code", "name")
      VALUES
        ('organization_admin', 'Администратор организации'),
        ('player', 'Игрок'),
        ('moderator', 'Модератор'),
        ('content_manager', 'Контент-менеджер')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE
      FROM "organization_roles"
      WHERE "code" IN (
        'organization_admin',
        'player',
        'moderator',
        'content_manager'
      );
    `);
  }
}
