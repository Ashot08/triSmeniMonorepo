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
import { GameStatus } from '../enums/game-status.enum';
import { User } from '@/modules/user/entities/user.entity';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GameMode } from '@/modules/game/enums/game-mode.enum';
import { GameOwnerType } from '@/modules/game/enums/game-owner-type.enum';

@Entity('games')
@Index(['organization', 'status'])
// @Index(['createdBy'])
@Index(['startedAt'])
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.PENDING,
  })
  status!: GameStatus;

  @Column({
    type: 'enum',
    enum: GameVisibility,
    default: GameVisibility.PUBLIC,
  })
  visibility!: GameVisibility;

  @Column({
    type: 'enum',
    enum: GameMode,
    default: GameMode.PVB,
  })
  gameMode!: GameMode;

  @Column({
    type: 'enum',
    enum: GameOwnerType,
    default: GameOwnerType.PLATFORM,
  })
  ownerType!: GameOwnerType;

  @Column({ type: 'integer', default: 2 })
  playersCount!: number;

  @Column({ type: 'integer', default: 3 })
  rounds!: number; // Количество раундов в игре

  @Column({ type: 'integer', default: 0 })
  currentRound!: number; // Текущий раунд (0 = не начиналась)

  // Ресурсы (начальные)
  @Column({ type: 'integer', default: 10 })
  startingCoins!: number; // Стартовый капитал

  @Column({ type: 'integer', default: 6 })
  workersPerPlayer!: number; // Количество работников у игрока

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date; // Когда началась игра

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date; // Когда закончилась игра

  @Column({ type: 'timestamp', nullable: true })
  scheduledStartAt?: Date; // Запланированное время начала

  // ✅ Участники
  // @OneToMany(() => GameParticipant, (participant) => participant.session, {
  //   cascade: true,
  // })
  // participants!: GameParticipant[];

  @Column({ type: 'integer', default: 0 })
  participantCount!: number; // Кэш количества участников

  @Column({ type: 'varchar', length: 50, nullable: true })
  inviteCode?: string; // Код для присоединения (если PRIVATE)

  // todo: сделать нормальную связь с контентом для вопросов
  // какие категории вопросов использовть,
  // использовать ли вопросы организации или только глобальные вопросы или и те и те
  // @Column({ type: 'uuid', nullable: true })
  // questionCategoryId?: string;

  @Column({ type: 'integer', default: 25 })
  answerTimeoutSeconds!: number;

  @Column({ type: 'boolean', default: true })
  isRecorded!: boolean; // Записывать ли в статистику

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date; // Soft delete

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @ManyToOne(() => Organization, (org) => org.games, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;
}
