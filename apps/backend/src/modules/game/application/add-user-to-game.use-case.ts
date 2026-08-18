import { Inject, Injectable } from '@nestjs/common';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';
import { AddUserToGameCommand } from '@/modules/game/application/interfaces/add-user-to-game-command.interface';
import { UserService } from '@/modules/user/user.service';
import { UserNotFoundError } from '@/modules/user/errors/user-not-found.error';

@Injectable()
export class AddUserToGameUseCase {
  constructor(
    private readonly gameValidationService: GameValidationService,
    private readonly gamePolicyService: GamePolicyService,
    @Inject(PendingGameRepository)
    private readonly pendingGameRepository: PendingGameRepository,
    private userService: UserService,
  ) {}

  async execute(command: AddUserToGameCommand) {
    const game = await this.pendingGameRepository.findById(command.id);
    const user = await this.userService.findById(command.dto.userId);

    if (!game) {
      throw new PendingGameNotFoundError();
    }

    if (!user) {
      throw new UserNotFoundError(command.dto.userId);
    }

    const policy = this.gamePolicyService.getAddUserToGamePolicy({
      user: command.user,
      organizationId: command.organizationId,
      organizationRoles: command.organizationRoles,
    });
    this.gameValidationService.validateAdd(game.settings, policy);

    game.join(command.dto.userId);

    return this.pendingGameRepository.update(game);
  }
}
