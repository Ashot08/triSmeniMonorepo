import { GameCreationPolicy } from '../interfaces/game-creation-policy.interface';
import { GameMode } from '@/modules/game/enums/game-mode.enum';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';

export const PLAYER_POLICY: GameCreationPolicy = {
  maxPlayers: 2,

  canUseCustomQuestions: false,
  canBranding: false,
  canCreateTournament: false,
  canInviteGuests: true,

  allowedGameModes: [
    GameMode.PVP,
    GameMode.PVB,
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
    GameMode.PVP,
    GameMode.PVB,
    GameMode.PVP_BOTS,
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

  allowedGameModes: Object.values(GameMode),

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

  allowedGameModes: Object.values(GameMode),

  allowedVisibilities: Object.values(GameVisibility),
};
