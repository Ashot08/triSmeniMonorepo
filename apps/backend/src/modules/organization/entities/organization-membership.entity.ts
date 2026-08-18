import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Organization } from './organization.entity';
import { OrganizationDepartment } from '@/modules/organization/entities/organization-department.entity';
import { OrganizationRole } from '@/modules/organization/entities/organization-role.entity';

@Entity('organization_memberships')
@Unique(['user', 'organization'])
export class OrganizationMembership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Organization, (org) => org.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @ManyToOne(() => OrganizationDepartment, (dept) => dept.memberships, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'department_id' })
  department!: OrganizationDepartment;

  @ManyToMany(() => OrganizationRole)
  @JoinTable({
    name: 'organization_memberships_roles',
    joinColumn: {
      name: 'organization_membership_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'organization_role_id',
      referencedColumnName: 'id',
    },
  })
  organizationRoles!: OrganizationRole[];

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @CreateDateColumn()
  joinedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
