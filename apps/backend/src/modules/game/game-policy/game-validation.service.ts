import { ForbiddenException, Injectable } from '@nestjs/common';
import { GameCreationPolicy } from './interfaces/game-creation-policy.interface';
import { PendingGameSettings } from '@/modules/game/pending-game/pending-game';
import { GameJoinTypePolicy } from '@/modules/game/game-policy/interfaces/join-game-policy.interface';
import { AddUserToGamePolicy } from '@/modules/game/game-policy/interfaces/add-user-to-game-policy.interface';

@Injectable()
export class GameValidationService {
  validateCreate(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ): void {
    this.validatePlayers(settings, policy);
    this.validatePvType(settings, policy);
    this.validateVisibility(settings, policy);
    this.validateJoinType(settings, policy);
  }

  validateJoin(
    settings: PendingGameSettings,
    policy: GameJoinTypePolicy | GameCreationPolicy,
  ): void {
    this.validateJoinType(settings, policy);
  }

  validateAdd(
    settings: PendingGameSettings,
    policy: AddUserToGamePolicy,
  ): void {
    this.validateJoinType(settings, policy);
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
      throw new ForbiddenException('Selected pv type mode is unavailable.');
    }
  }

  private validateJoinType(
    settings: PendingGameSettings,
    policy: GameJoinTypePolicy | GameCreationPolicy,
  ) {
    if (!policy.allowedJoinTypes.includes(settings.joinType)) {
      throw new ForbiddenException('Selected join type mode is unavailable.');
    }
  }

  private validateVisibility(
    settings: PendingGameSettings,
    policy: GameCreationPolicy,
  ) {
    if (
      settings.visibility &&
      !policy.allowedVisibilities.includes(settings.visibility)
    ) {
      throw new ForbiddenException('Selected visibility is unavailable.');
    }
  }
}
