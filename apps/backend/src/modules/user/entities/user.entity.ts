import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index, ManyToMany, JoinTable,
} from 'typeorm';
import { Role } from '@/modules/role/entities/role.entity';

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
export class User {
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

  @ManyToMany(() => Role, (role) => role.users, { cascade: false })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: Role[];
}
