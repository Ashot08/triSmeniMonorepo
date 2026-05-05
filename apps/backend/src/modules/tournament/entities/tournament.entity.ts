import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('tournaments')
@Index(['organization'])
@Index(['createdBy'])
@Index(['startDate'])
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // ✅ Организация (опционально, может быть NULL если турнир от платформы)
  @ManyToOne(() => Organization, (org) => org.tournaments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  // ✅ Создатель турнира
  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  // ✅ Статус турнира

  // ✅ Тип турнира

  // ✅ Формат турнира


  // ✅ Параметры участия
  @Column({ type: 'integer', default: 2 })
  minParticipants!: number;

  @Column({ type: 'integer', default: 100 })
  maxParticipants!: number;

  @Column({ type: 'integer', default: 0 })
  participantCount!: number; // Кэш текущего количества

  // ✅ Расписание
  @Column({ type: 'timestamp', nullable: false })
  startDate!: Date; // Когда начинается регистрация/турнир

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date; // Когда заканчивается турнир

  @Column({ type: 'timestamp', nullable: true })
  registrationDeadline?: Date; // Крайний срок регистрации

  // ✅ Параметры матчей
  @Column({ type: 'integer', default: 5 })
  roundsPerMatch!: number; // Раундов в одном матче

  @Column({ type: 'integer', default: 300 })
  matchTimeoutSeconds!: number; // Таймаут на матч в сек

  // ✅ Тема контента
  @Column({ type: 'uuid', nullable: true })
  questionCategoryId?: string; // Категория вопросов

  @Column({ type: 'integer', nullable: true })
  difficulty?: number; // Сложность 1-5

  // ✅ Награды
  @Column({ type: 'integer', default: 0 })
  rewardPool!: number; // Общий пул награды

  @Column({ type: 'jsonb', nullable: true })
  rewards?: TournamentRewards; // Структура наград (место -> награда)

  // ✅ Видимость и доступ
  @Column({
    type: 'enum',
    enum: ['PUBLIC', 'PRIVATE', 'INVITE_ONLY'],
    default: 'PUBLIC',
  })
  visibility!: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';

  @Column({ type: 'varchar', length: 50, nullable: true })
  inviteCode?: string; // Код для присоединения

  // ✅ Отношения
  // @OneToMany(() => TournamentParticipant, (participant) => participant.tournament, {
  //   cascade: true,
  // })
  // participants!: TournamentParticipant[];
  //
  // @OneToMany(() => TournamentMatch, (match) => match.tournament, {
  //   cascade: true,
  // })
  // matches!: TournamentMatch[];

  // ✅ Статистика
  @Column({ type: 'integer', default: 0 })
  matchCount!: number; // Кэш количества матчей

  @Column({ type: 'boolean', default: true })
  isRecorded!: boolean; // Записывать ли в статистику

  // ✅ Информация о создателе (для истории)
  @Column({ type: 'varchar', length: 255, nullable: true })
  creatorName?: string;

  // ✅ Аудит
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date; // Soft delete
}

// ✅ Интерфейс для структуры наград
export interface TournamentRewards {
  [place: number]: {
    coins?: number; // Игровая валюта
    badge?: string; // ID бейджа/достижения
    realPrize?: string; // Описание реальной награды
    bonusPoints?: number; // Бонусные очки
  };
}
