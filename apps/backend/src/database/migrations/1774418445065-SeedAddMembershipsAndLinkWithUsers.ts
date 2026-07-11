import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrganizationMemberships1774418445065
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO organization_memberships (
        user_id,
        organization_id,
        "isActive"
      )
      SELECT
        u.id,
        o.id,
        true
      FROM users u
      JOIN organizations o
        ON o.slug = u.username
      WHERE u.username IN (
        'tri-smeni',
        'stroymontazh',
        'safety-center'
      );
    `);

    await queryRunner.query(`
      INSERT INTO organization_memberships_roles (
        organization_membership_id,
        organization_role_id
      )
      SELECT
        om.id,
        r.id
      FROM organization_memberships om
      JOIN users u
        ON u.id = om.user_id
      JOIN organization_roles r
        ON r.code = 'organization_admin'
      WHERE u.username IN (
        'tri-smeni',
        'stroymontazh',
        'safety-center'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM organization_memberships_roles
      WHERE organization_membership_id IN (
        SELECT om.id
        FROM organization_memberships om
        JOIN users u
          ON u.id = om.user_id
        WHERE u.username IN (
          'tri-smeni',
          'stroymontazh',
          'safety-center'
        )
      );
    `);

    await queryRunner.query(`
      DELETE FROM organization_memberships
      WHERE user_id IN (
        SELECT id
        FROM users
        WHERE username IN (
          'tri-smeni',
          'stroymontazh',
          'safety-center'
        )
      );
    `);
  }
}
