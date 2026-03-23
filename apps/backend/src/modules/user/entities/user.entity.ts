import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  PLAYER = 'player',
  SUBSCRIPTION_OWNER = 'subscription_owner',
  ORGANIZATION_ADMIN = 'organization_admin',
  PLATFORM_ADMIN = 'platform_admin',
  MODERATOR = 'moderator',
  CONTENT_MANAGER = 'content_manager',
}

export enum AuthProvider {
  EMAIL = 'email',
  VK = 'vk',
  YANDEX = 'yandex',
  TELEGRAM = 'telegram',
  MAX = 'max',
}

@Entity({ name: 'users' })
@Index(['email'], { unique: true, where: '"email" IS NOT NULL' })
@Index(['username'], { unique: true, where: '"username" IS NOT NULL' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email!: string | null;

  @Column({ type: 'text', nullable: true })
  password!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName!: string | null;

  @Column({ type: 'text', nullable: true })
  avatar!: string | null;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    array: true,
    default: [AuthProvider.EMAIL],
  })
  authProviders!: AuthProvider[];

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.PLAYER],
  })
  roles!: UserRole[];

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isBanned!: boolean;

  @Column({ type: 'text', nullable: true })
  banReason!: string | null;

  @Column({ type: 'boolean', default: false })
  isMuted!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  mutedUntil!: Date | null;

  @Column({ type: 'int', default: 0 })
  level!: number;

  @Column({ type: 'int', default: 0 })
  experience!: number;

  @Column({ type: 'int', default: 0 })
  rating!: number;

  @Column({ type: 'int', default: 0 })
  gamesPlayed!: number;

  @Column({ type: 'float', default: 0 })
  correctAnswersPercentage!: number;

  @Column({ type: 'int', default: 0 })
  totalWorkers!: number;

  @Column({ type: 'int', default: 0 })
  injuredWorkers!: number;

  @Column({ type: 'text', array: true, default: [] })
  badges!: string[];

  @Column({ type: 'boolean', default: true })
  notificationsEnabled!: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  theme!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vkId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  yandexId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telegramId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  maxId!: string | null;
}
