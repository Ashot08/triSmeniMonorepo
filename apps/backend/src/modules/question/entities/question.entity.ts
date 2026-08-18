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
// import { QuestionAnswer } from './question-answer.entity';
// import { QuestionCategory } from './question-category.entity';
// import { QuestionType } from '../enums/question-type.enum';
// import { QuestionDifficulty } from '../enums/question-difficulty.enum';

@Entity('questions')
// @Index(['difficulty'])
@Index(['organization', 'status'])
@Index(['createdBy'])
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  text!: string; // Текст вопроса

  @Column({ type: 'text', nullable: true })
  description?: string; // Дополнительное описание

  // ✅ Тип вопроса
  // @Column({
  //   type: 'enum',
  //   enum: QuestionType,
  //   default: QuestionType.SINGLE_CHOICE,
  // })
  // type!: QuestionType;

  // ✅ Сложность вопроса
  // @Column({
  //   type: 'enum',
  //   enum: QuestionDifficulty,
  //   default: QuestionDifficulty.MEDIUM,
  // })
  // difficulty!: QuestionDifficulty;

  // ✅ Категория вопроса
  // @ManyToOne(() => QuestionCategory, (category) => category.questions, {
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'category_id' })
  // category?: QuestionCategory;

  // ✅ Организация (если это её собственный вопрос)
  @ManyToOne(() => Organization, (org) => org.customQuestions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  // ✅ Автор вопроса (контент-менеджер или сотрудник организации)
  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  // ✅ Ответы на вопрос
  // @OneToMany(() => QuestionAnswer, (answer) => answer.question, {
  //   cascade: true,
  // })
  // answers!: QuestionAnswer[];

  @Column({ type: 'integer', default: 0 })
  answersCount!: number; // Кэш количества ответов

  // ✅ Медиа контент (изображение вопроса)
  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string; // URL изображения на S3/MinIO

  @Column({ type: 'varchar', nullable: true })
  imageKey?: string; // Ключ изображения в хранилище

  // ✅ Объяснение (почему ответ правильный)
  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @Column({ type: 'varchar', nullable: true })
  explanationImageUrl?: string;

  // ✅ Интерактивное испытание (мини-игра)
  @Column({ type: 'jsonb', nullable: true })
  interactiveChallenge?: InteractiveChallenge;

  // ✅ Теги для поиска и фильтрации
  @Column({ type: 'varchar', length: 500, nullable: true })
  tags?: string; // Запятая-разделённые теги

  // ✅ Статус вопроса
  @Column({
    type: 'enum',
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REJECTED'],
    default: 'DRAFT',
  })
  status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED';

  // ✅ Статистика
  @Column({ type: 'integer', default: 0 })
  timesUsed!: number; // Сколько раз использован в играх

  @Column({ type: 'float', default: 0 })
  correctAnswerPercentage!: number; // Процент правильных ответов (%)

  // ✅ Правила использования
  @Column({ type: 'boolean', default: true })
  isPublic!: boolean; // Доступен ли для других организаций

  @Column({ type: 'boolean', default: true })
  isActive!: boolean; // Активен ли для использования

  // ✅ Примечания
  @Column({ type: 'text', nullable: true })
  notes?: string; // Примечания для контент-менеджеров

  // ✅ Ревизия контента
  @Column({ type: 'integer', default: 1 })
  version!: number; // Версия вопроса

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt?: Date; // Когда последний раз проверили

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'reviewed_by_id' })
  reviewedBy?: User; // Кто проверил вопрос

  // ✅ Аудит
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date; // Soft delete
}

// ✅ TypeScript интерфейс для интерактивного испытания
export interface InteractiveChallenge {
  type: 'MAP_NAVIGATION' | 'FIRE_EXTINGUISHING' | 'PPE_SELECTION';
  title: string;
  description?: string;
  timeLimit: number; // секунды
  data: Record<string, any>; // Данные специфичные для типа испытания
  successCriteria: {
    minCorrectActions: number;
    maxErrors: number;
  };
}
