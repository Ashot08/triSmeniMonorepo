import { Inject, Injectable } from '@nestjs/common';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';
import { JoinGameCommand } from '@/modules/game/application/interfaces/join-game-command.interface';

@Injectable()
export class JoinGameUseCase {
  constructor(
    private readonly gameValidationService: GameValidationService,
    private readonly gamePolicyService: GamePolicyService,
    @Inject(PendingGameRepository) private readonly pendingGameRepository: PendingGameRepository,
  ) {}
  async execute(command: JoinGameCommand) {
    const game = await this.pendingGameRepository.findById(command.id);
    // возвращать объект доменной сущности PendingGame
    // PendingGame.join(...)
    // pendingGameRepository.save(...)
    return game;
  }
}
