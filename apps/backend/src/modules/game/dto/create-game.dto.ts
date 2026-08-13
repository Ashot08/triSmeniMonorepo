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
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    example: `Игра от ${new Date().toLocaleString('ru-RU')}`,
  })
  @IsString()
  @Length(1, 255)
  name!: string;

  @ApiProperty({
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(2)
  @Max(100)
  playersCount: number;

  @ApiProperty({
    example: 'Игра для тестирования.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: GameJoinType.JOINABLE,
  })
  @IsOptional()
  @IsEnum(GameJoinType)
  joinType?: GameJoinType;

  @ApiProperty({
    example: GamePvType.PVB,
  })
  @IsOptional()
  @IsEnum(GamePvType)
  gamePvType?: GamePvType;

  @ApiProperty({
    example: GameVisibility.VISIBLE,
  })
  @IsOptional()
  @IsEnum(GameVisibility)
  visibility?: GameVisibility;

  @ApiProperty({
    example: GameQuestionsType.BOTH,
  })
  @IsOptional()
  @IsEnum(GameQuestionsType)
  questionsType?: GameQuestionsType;

  @ApiProperty({
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  shiftsCount?: number;

  @ApiProperty({
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  startingCoins?: number;

  @ApiProperty({
    example: 6,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  workersPerPlayer?: number;

  @ApiProperty({
    example: '2026-08-13T11:46:43Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledStartAt?: string;

  @ApiProperty({
    example: '3104',
  })
  @IsOptional()
  @IsString()
  @Length(4, 50)
  inviteCode?: string;

  @ApiProperty({
    example: 25,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(300)
  answerTimeoutSeconds?: number;

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRecordedToStatistics?: boolean;
}
