import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateGameDto } from '@/modules/game/dto/create-game.dto';
import { GameCreationPolicy } from './interfaces/game-creation-policy.interface';

@Injectable()
export class GameValidationService {

  validate(
    dto: CreateGameDto,
    policy: GameCreationPolicy,
  ): void {
    this.validatePlayers(dto, policy);
    this.validateMode(dto, policy);
    this.validateVisibility(dto, policy);
  }

  private validatePlayers(
    dto: CreateGameDto,
    policy: GameCreationPolicy,
  ) {
    if (dto.playersCount > policy.maxPlayers) {
      throw new ForbiddenException(
        `Maximum ${policy.maxPlayers} players allowed.`,
      );
    }
  }

  private validateMode(
    dto: CreateGameDto,
    policy: GameCreationPolicy,
  ) {
    if (!policy.allowedGameModes.includes(dto.gameMode)) {
      throw new ForbiddenException(
        'Selected game mode is unavailable.',
      );
    }
  }

  private validateVisibility(
    dto: CreateGameDto,
    policy: GameCreationPolicy,
  ) {
    if (dto.visibility && (
      !policy.allowedVisibilities.includes(
        dto.visibility,
      )
    )) {
      throw new ForbiddenException(
        'Selected visibility is unavailable.',
      );
    }
  }
}
