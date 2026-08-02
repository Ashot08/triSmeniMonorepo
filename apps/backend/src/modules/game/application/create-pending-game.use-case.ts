import { Injectable } from '@nestjs/common';
import { GameService } from '../game.service';
import { GameValidationService } from '../game-policy/game-validation.service';
import { GamePolicyService } from '../game-policy/game-policy.service';
import { CreateGameCommand } from './interfaces/create-game-command.interface';
import { PendingGame } from '../pending-game/pending-game';
import { GameJoinType } from '../enums/game-join-type.enum';
import { GamePvType } from '../enums/game-pv-type.enum';
import { GameVisibility } from '../enums/game-visibility.enum';
import { defaultGameOptions } from '../constants/default-game-options';

@Injectable()
export class CreateGameUseCase {
  constructor(
    private readonly gameService: GameService,
    private readonly gameValidationService: GameValidationService,
    private readonly gamePolicyService: GamePolicyService,
  ) {}

  async execute(command: CreateGameCommand) {
    const policy = this.gamePolicyService.getCreateGamePolicy({
      user: command.user,
      organizationId: command.organizationId,
      organizationRoles: command.organizationRoles,
    });

    this.gameValidationService.validateCreate(
      command.dto,
      policy,
    );

    const game = PendingGame.create(
      {
        ownerId: command.user.id,
        organizationId: command.organizationId,
        settings: {
          ...command.dto,
          joinType: GameJoinType.JOINABLE,
          gamePvType: GamePvType.PVB,
          visibility: command.dto.visibility ?? GameVisibility.VISIBLE,
          shiftsCount: command.dto.shiftsCount ?? defaultGameOptions.SHIFTS_COUNT,
          startingCoins: command.dto.startingCoins ?? defaultGameOptions.STARTING_COINS,
          workersPerPlayer: command.dto.workersPerPlayer ?? defaultGameOptions.WORKERS_PER_PLAYER,
          answerTimeoutSeconds: command.dto.answerTimeoutSeconds ?? defaultGameOptions.ANSWER_TIMEOUT_SECONDS,
          isRecordedToStatistics: command.dto.isRecordedToStatistics ?? defaultGameOptions.IS_RECORDED_TO_STATISTICS,
          questionsType: command.dto.questionsType ?? defaultGameOptions.QUESTIONS_TYPE,
        },
      }
    );

    return await this.gameService.create({
      dto: command.dto,
      organizationId: command.organizationId,
      createdById: command.user.id,
    });
  }
}
