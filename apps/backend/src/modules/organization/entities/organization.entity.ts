import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { OrganizationMembership } from './organization-membership.entity';
import { OrganizationDepartment } from './organization-department.entity';
import { Game } from '@/modules/game/entities/game.entity';
import { Tournament } from '@/modules/tournament/entities/tournament.entity';
import { Question } from '@/modules/content/entities/question.entity';
import { OrganizationPlan, OrganizationStatus, OrganizationType } from '@/common/enums/organization.enum';

@Entity('organizations')
@Index(['slug'], { unique: true })
@Index(['ownerId'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: false })
  ownerId!: string;

  @Column({ type: 'varchar', nullable: true })
  logoUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  primaryColor?: string;

  @Column({ type: 'varchar', nullable: true })
  secondaryColor?: string;

  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    default: OrganizationStatus.ACTIVE,
  })
  status!: OrganizationStatus;

  @Column({
    type: 'enum',
    enum: OrganizationType,
    default: OrganizationType.COMPANY,
  })
  type!: OrganizationType;

  @Column({
    type: 'enum',
    enum: OrganizationPlan,
    default: OrganizationPlan.FREE,
  })
  plan!: OrganizationPlan;

  @Column({ type: 'integer', default: 0 })
  memberCount!: number;

  @Column({ type: 'integer', default: 100 })
  maxMembers!: number;

  @OneToMany(() => OrganizationMembership, (membership) => membership.organization)
  memberships!: OrganizationMembership[];

  @OneToMany(() => OrganizationDepartment, (dept) => dept.organization)
  departments!: OrganizationDepartment[];

  @OneToMany(() => Game, (game) => game.organization,)
  games!: Game[];
  // todo: в связанной таблице сделать onDelete: 'SET NULL'
  @OneToMany(() => Tournament, (tournament) => tournament.organization,)
  tournaments!: Tournament[];
  // todo: в связанной таблице сделать onDelete: 'SET NULL'
  @OneToMany(() => Question, (question) => question.organization,)
  customQuestions!: Question[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
