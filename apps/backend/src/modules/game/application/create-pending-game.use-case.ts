import { Inject, Injectable } from '@nestjs/common';
import { GameValidationService } from '../game-policy/game-validation.service';
import { GamePolicyService } from '../game-policy/game-policy.service';
import { CreateGameCommand } from './interfaces/create-game-command.interface';
import { PendingGame } from '../pending-game/pending-game';
import { GameJoinType } from '../enums/game-join-type.enum';
import { GamePvType } from '../enums/game-pv-type.enum';
import { GameVisibility } from '../enums/game-visibility.enum';
import { defaultGameOptions } from '../constants/default-game-options';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';

@Injectable()
export class CreatePendingGameUseCase {
  constructor(
    private readonly gameValidationService: GameValidationService,
    private readonly gamePolicyService: GamePolicyService,
    @Inject(PendingGameRepository) private readonly pendingGameRepository: PendingGameRepository,
  ) {}

  async execute(command: CreateGameCommand) {
    const gameSettings = {
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
    };

    const policy = this.gamePolicyService.getCreateGamePolicy({
      user: command.user,
      organizationId: command.organizationId,
      organizationRoles: command.organizationRoles,
    });

    this.gameValidationService.validateCreate(
      gameSettings,
      policy,
    );

    const game = PendingGame.create(
      {
        ownerId: command.user.id,
        organizationId: command.organizationId,
        settings: gameSettings,
      }
    );

    return this.pendingGameRepository.save(game);
  }
}
