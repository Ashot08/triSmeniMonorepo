import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1774418445062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (
        username,
        email,
        password,
        "firstName",
        "lastName",
        "isEmailVerified",
        "isActive"
      )
      VALUES
        (
          'tri-smeni',
          'tri-smeni@example.com',
          '$2a$12$uFplXMnLpzrT.jLazgQ87ec5yjekUkhteq/ezip9O4qLBXTbjfzvS',
          'Три',
          'Смены',
          true,
          true
        ),
        (
          'stroymontazh',
          'stroymontazh@example.com',
          '$2a$12$uFplXMnLpzrT.jLazgQ87ec5yjekUkhteq/ezip9O4qLBXTbjfzvS',
          'Строй',
          'Монтаж',
          true,
          true
        ),
        (
          'safety-center',
          'safety-center@example.com',
          '$2a$12$uFplXMnLpzrT.jLazgQ87ec5yjekUkhteq/ezip9O4qLBXTbjfzvS',
          'Safety',
          'Center',
          true,
          true
        );
    `);

    await queryRunner.query(`
        INSERT INTO users_roles (user_id, role_id)
        SELECT u.id,
               r.id
        FROM users u
                 CROSS JOIN roles r
        WHERE u.username IN (
                             'tri-smeni',
                             'stroymontazh',
                             'safety-center'
            )
          AND r.code = 'player';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE
      FROM users
      WHERE username IN (
        'tri-smeni',
        'stroymontazh',
        'safety-center'
      );
    `);
  }
}
