import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

    if(!game) {
      throw new NotFoundException('Game does not exist');
    }

    const policy = this.gamePolicyService.getJoinGamePolicy();
    this.gameValidationService.validateJoin(game.settings, policy);

    game.join(command.user.id);

    return this.pendingGameRepository.update(game);
  }
}
