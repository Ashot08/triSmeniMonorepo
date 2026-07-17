import { Injectable } from '@nestjs/common';
import { GameService } from '@/modules/game/game.service';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { CreateGameCommand } from '@/modules/game/application/interfaces/create-game-command.interface';

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
    });

    this.gameValidationService.validateCreate(
      command.dto,
      policy,
    );

    return await this.gameService.create({
      dto: command.dto,
      organizationId: command.organizationId,
      createdById: command.user.id,
    });
  }
}
