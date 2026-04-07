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
import { Organization } from '@/modules/organization/entities/organization.entity';
import { User } from '@/modules/user/entities/user.entity';
import { GameRound } from './game-round.entity';
import { GameParticipant } from './game-participant.entity';
import { GameStatus } from '../enums/game-status.enum';

@Entity('game_sessions')
@Index(['organization', 'status'])
@Index(['createdBy'])
@Index(['startedAt'])
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // ✅ Организация, создавшая игру (опционально, может быть NULL)
  @ManyToOne(() => Organization, (org) => org.games, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  // ✅ Кто создал игру (User ID)
  @Column({ type: 'uuid', nullable: false })
  createdBy!: string;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  creator?: User;

  // ✅ Статус игры
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.PENDING,
  })
  status!: GameStatus;

  // ✅ Параметры игры
  @Column({ type: 'integer', default: 2 })
  minPlayers!: number;

  @Column({ type: 'integer', default: 12 })
  maxPlayers!: number;

  @Column({ type: 'integer', default: 5 })
  rounds!: number; // Количество раундов в игре

  @Column({ type: 'integer', default: 0 })
  currentRound!: number; // Текущий раунд (0 = не начиналась)

  // ✅ Ресурсы (начальные)
  @Column({ type: 'integer', default: 10 })
  startingCoins!: number; // Стартовый капитал

  @Column({ type: 'integer', default: 6 })
  workersPerPlayer!: number; // Количество работников у игрока

  // ✅ Время игры
  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date; // Когда началась игра

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date; // Когда закончилась игра

  @Column({ type: 'timestamp', nullable: true })
  scheduledStartAt?: Date; // Запланированное время начала

  // ✅ Участники
  @OneToMany(() => GameParticipant, (participant) => participant.session, {
    cascade: true,
  })
  participants!: GameParticipant[];

  @Column({ type: 'integer', default: 0 })
  participantCount!: number; // Кэш количества участников

  // ✅ Раунды игры
  @OneToMany(() => GameRound, (round) => round.session, {
    cascade: true,
  })
  rounds_data!: GameRound[];

  // ✅ Настройки видимости
  @Column({
    type: 'enum',
    enum: ['PUBLIC', 'PRIVATE', 'INVITE_ONLY'],
    default: 'PUBLIC',
  })
  visibility!: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';

  @Column({ type: 'varchar', length: 50, nullable: true })
  inviteCode?: string; // Код для присоединения (если PRIVATE)

  // ✅ Настройки контента
  @Column({ type: 'uuid', nullable: true })
  questionCategoryId?: string; // Категория вопросов

  @Column({ type: 'integer', nullable: true })
  difficulty?: number; // Сложность (1-5)

  // ✅ Режим игры
  @Column({
    type: 'enum',
    enum: ['REAL_TIME', 'TURN_BASED', 'HYBRID'],
    default: 'REAL_TIME',
  })
  gameMode!: 'REAL_TIME' | 'TURN_BASED' | 'HYBRID';

  @Column({ type: 'integer', default: 300 }) // 5 минут на ход
  turnTimeoutSeconds!: number;

  // ✅ Награды и мониторинг
  @Column({ type: 'integer', default: 0 })
  rewardPool!: number; // Общий пул награды

  @Column({ type: 'boolean', default: true })
  isRecorded!: boolean; // Записывать ли в статистику

  // ✅ Информация о создателе (для истории)
  @Column({ type: 'varchar', length: 255, nullable: true })
  creatorName?: string; // Сохраняем имя на случай удаления пользователя

  // ✅ Аудит
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date; // Soft delete
}
