import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { GameStatus } from '../enums/game-status.enum';
import { GameVisibility } from '../enums/game-visibility.enum';
import { GameMode } from '../enums/game-mode.enum';

export class CreateGameDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(100)
  playersCount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  rounds?: number;

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
  @IsEnum(GameVisibility)
  visibility?: GameVisibility;

  @IsOptional()
  @IsString()
  @Length(4, 50)
  inviteCode?: string;

  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(300)
  answerTimeoutSeconds?: number;

  @IsOptional()
  @IsBoolean()
  isRecorded?: boolean;
}
