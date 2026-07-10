import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';

@Entity({ name: 'organization_roles' })
export class OrganizationRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, nullable: false })
  code!: OrganizationRoleCode;

  @Column({ type: 'varchar', length: 128, nullable: false })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
