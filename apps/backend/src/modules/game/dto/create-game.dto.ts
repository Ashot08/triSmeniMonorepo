import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { GameStatus } from '../enums/game-status.enum';

export enum GameVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY',
}

export enum GameMode {
  REAL_TIME = 'REAL_TIME',
  TURN_BASED = 'TURN_BASED',
  HYBRID = 'HYBRID',
}

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
