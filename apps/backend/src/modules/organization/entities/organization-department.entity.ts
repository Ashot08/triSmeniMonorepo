import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Organization } from './organization.entity';
import { OrganizationMembership } from './organization-membership.entity';

@Entity('organization_departments')
@Index(['organization', 'name'])
export class OrganizationDepartment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  code?: string;

  @ManyToOne(() => Organization, (org) => org.departments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @OneToMany(
    () => OrganizationMembership,
    (membership) => membership.department,
  )
  memberships!: OrganizationMembership[];

  @Column({ type: 'integer', default: 0 })
  memberCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deactivatedAt?: Date;
}
