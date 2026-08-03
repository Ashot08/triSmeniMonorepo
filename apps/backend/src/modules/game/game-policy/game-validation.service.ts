import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GameCreationPolicy } from './interfaces/game-creation-policy.interface';
import { PendingGameSettings } from '@/modules/game/pending-game/pending-game';

@Injectable()
export class GameValidationService {

  validateCreate(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ): void {
    this.validatePlayers(settings, policy);
    this.validatePvType(settings, policy);
    this.validateVisibility(settings, policy);
  }

  private validatePlayers(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ) {
    if (settings.playersCount > policy.maxPlayers) {
      throw new ForbiddenException(
        `Maximum ${policy.maxPlayers} players allowed.`,
      );
    }
  }

  private validatePvType(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ) {
    if (!policy.allowedGamePvTypes.includes(settings.gamePvType)) {
      throw new ForbiddenException(
        'Selected pv type mode is unavailable.',
      );
    }
  }

  private validateJoinType(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ) {
    if (!policy.allowedJoinTypes.includes(settings.joinType)) {
      throw new ForbiddenException(
        'Selected join type mode is unavailable.',
      );
    }
  }

  private validateVisibility(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ) {
    if (settings.visibility && (
      !policy.allowedVisibilities.includes(
        settings.visibility,
      )
    )) {
      throw new ForbiddenException(
        'Selected visibility is unavailable.',
      );
    }
  }
}
