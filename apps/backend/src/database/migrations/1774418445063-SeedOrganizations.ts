import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrganizations1774418445063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO organizations (
        name,
        slug,
        description,
        website,
        email,
        phone,
        address,
        status,
        type,
        plan,
        "memberCount",
        "maxMembers",
        owner_id
      )
      SELECT
        'ООО "Три Смены"',
        'tri-smeni',
        'Организация разработчиков игры по охране труда',
        'https://tri-smeni.ru',
        'info@tri-smeni.ru',
        '+7 (999) 111-11-11',
        'г. Москва',
        'ACTIVE',
        'COMPANY',
        'FREE',
        1,
        100,
        u.id
      FROM users u
      WHERE u.username = 'tri-smeni';

      INSERT INTO organizations (
        name,
        slug,
        description,
        website,
        email,
        phone,
        address,
        status,
        type,
        plan,
        "memberCount",
        "maxMembers",
        owner_id
      )
      SELECT
        'ООО "СтройМонтаж"',
        'stroymontazh',
        'Строительная организация',
        'https://stroymontazh.ru',
        'office@stroymontazh.ru',
        '+7 (999) 222-22-22',
        'г. Екатеринбург',
        'ACTIVE',
        'COMPANY',
        'FREE',
        1,
        50,
        u.id
      FROM users u
      WHERE u.username = 'stroymontazh';

      INSERT INTO organizations (
        name,
        slug,
        description,
        website,
        email,
        phone,
        address,
        status,
        type,
        plan,
        "memberCount",
        "maxMembers",
        owner_id
      )
      SELECT
        'Учебный центр "Безопасность"',
        'safety-center',
        'Обучение по охране труда',
        'https://safety-center.ru',
        'info@safety-center.ru',
        '+7 (999) 333-33-33',
        'г. Казань',
        'ACTIVE',
        'COMPANY',
        'FREE',
        1,
        500,
        u.id
      FROM users u
      WHERE u.username = 'safety-center';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE
      FROM organizations
      WHERE slug IN (
        'tri-smeni',
        'stroymontazh',
        'safety-center'
      );
    `);
  }
}
