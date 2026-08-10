import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';
import { AddUserToGameCommand } from '@/modules/game/application/interfaces/add-user-to-game-command.interface';

@Injectable()
export class AddUserToGameUseCase {
  constructor(
    private readonly gameValidationService: GameValidationService,
    private readonly gamePolicyService: GamePolicyService,
    @Inject(PendingGameRepository) private readonly pendingGameRepository: PendingGameRepository,
  ) {
  }

  async execute(command: AddUserToGameCommand) {
    const game = await this.pendingGameRepository.findById(command.id);

    if (!game) {
      throw new PendingGameNotFoundError();
    }
    const policy = this.gamePolicyService.getJoinGamePolicy();
    this.gameValidationService.validateJoin(game.settings, policy);

    game.join(command.user.id);

    return this.pendingGameRepository.update(game);
  }
}
