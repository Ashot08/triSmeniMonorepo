import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt, IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { GameVisibility } from '../enums/game-visibility.enum';
import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';
import { GamePvType } from '@/modules/game/enums/game-pv-type.enum';
import { GameQuestionsType } from '@/modules/game/enums/game-questions-type.enum';

export class CreateGameDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(2)
  @Max(100)
  playersCount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GameJoinType)
  joinType?: GameJoinType;

  @IsOptional()
  @IsEnum(GamePvType)
  gamePvType?: GamePvType;

  @IsOptional()
  @IsEnum(GameVisibility)
  visibility?: GameVisibility;

  @IsOptional()
  @IsEnum(GameQuestionsType)
  questionsType?: GameQuestionsType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  shiftsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  startingCoins?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  workersPerPlayer?: number;

  @IsOptional()
  @IsDateString()
  scheduledStartAt?: string;

  @IsOptional()
  @IsString()
  @Length(4, 50)
  inviteCode?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(300)
  answerTimeoutSeconds?: number;

  @IsOptional()
  @IsBoolean()
  isRecordedToStatistics?: boolean;
}
