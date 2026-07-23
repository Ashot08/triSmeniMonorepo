import { GameCreationPolicy } from '../interfaces/game-creation-policy.interface';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GamePvType } from '../../enums/game-pv-type.enum';

export const PLAYER_POLICY: GameCreationPolicy = {
  maxPlayers: 2,

  canUseCustomQuestions: false,
  canBranding: false,
  canCreateTournament: false,
  canInviteGuests: true,

  allowedGameModes: [
    GamePvType.PVP,
    GamePvType.PVB,
  ],

  allowedVisibilities: [
    GameVisibility.PUBLIC,
  ],
};

export const SUBSCRIPTION_OWNER_POLICY: GameCreationPolicy = {
  maxPlayers: 8,

  canUseCustomQuestions: false,
  canBranding: true,
  canCreateTournament: false,
  canInviteGuests: true,

  allowedGameModes: [
    GamePvType.PVP,
    GamePvType.PVB,
    GamePvType.PVP_BOTS,
  ],

  allowedVisibilities: [
    GameVisibility.PRIVATE,
    GameVisibility.PUBLIC,
  ],
};

export const ORGANIZATION_POLICY: GameCreationPolicy = {
  maxPlayers: 20,

  canUseCustomQuestions: true,
  canBranding: true,
  canCreateTournament: true,
  canInviteGuests: true,

  allowedGameModes: Object.values(GamePvType),

  allowedVisibilities: [
    GameVisibility.PRIVATE,
    GameVisibility.ORGANIZATION,
  ],
};

export const PLATFORM_ADMIN_POLICY: GameCreationPolicy = {
  maxPlayers: 20,

  canUseCustomQuestions: true,
  canBranding: true,
  canCreateTournament: true,
  canInviteGuests: true,

  allowedGameModes: Object.values(GamePvType),

  allowedVisibilities: Object.values(GameVisibility),
};
