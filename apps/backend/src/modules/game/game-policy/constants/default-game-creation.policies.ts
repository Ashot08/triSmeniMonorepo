import { GameCreationPolicy } from '../interfaces/game-creation-policy.interface';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GamePvType } from '../../enums/game-pv-type.enum';
import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';

export const PLAYER_POLICY: GameCreationPolicy = {
  maxPlayers: 2,

  canUseCustomQuestions: false,
  canBranding: false,
  canCreateTournament: false,
  canInviteGuests: true,

  allowedGamePvTypes: [
    GamePvType.PVP,
    GamePvType.PVB,
  ],

  allowedJoinTypes: [
    GameJoinType.JOINABLE,
  ],

  allowedVisibilities: [
    GameVisibility.VISIBLE,
  ],
};

export const SUBSCRIPTION_OWNER_POLICY: GameCreationPolicy = {
  maxPlayers: 8,

  canUseCustomQuestions: false,
  canBranding: true,
  canCreateTournament: false,
  canInviteGuests: true,

  allowedGamePvTypes: [
    GamePvType.PVP,
    GamePvType.PVB,
    GamePvType.PVP_BOTS,
  ],

  allowedJoinTypes: [
    GameJoinType.JOINABLE,
    GameJoinType.JOIN_WITH_CODE,
    GameJoinType.ONLY_ADD_BY_CREATOR,
  ],

  allowedVisibilities: [
    GameVisibility.VISIBLE,
    GameVisibility.HIDDEN,
  ],
};

export const ORGANIZATION_ADMIN_POLICY: GameCreationPolicy = {
  maxPlayers: 20,

  canUseCustomQuestions: true,
  canBranding: true,
  canCreateTournament: true,
  canInviteGuests: true,

  allowedGamePvTypes: Object.values(GamePvType),

  allowedVisibilities: [
    GameVisibility.VISIBLE,
    GameVisibility.HIDDEN,
  ],

  allowedJoinTypes: [
    GameJoinType.JOINABLE,
    GameJoinType.JOIN_WITH_CODE,
    GameJoinType.ONLY_ADD_BY_CREATOR,
  ],
};

export const ORGANIZATION_PLAYER_POLICY: GameCreationPolicy = {
  maxPlayers: 2,

  canUseCustomQuestions: false,
  canBranding: false,
  canCreateTournament: false,
  canInviteGuests: true,

  allowedGamePvTypes: [
    GamePvType.PVP,
    GamePvType.PVB,
  ],

  allowedJoinTypes: [
    GameJoinType.JOINABLE,
    GameJoinType.JOIN_WITH_CODE,
    GameJoinType.ONLY_ADD_BY_CREATOR,
  ],

  allowedVisibilities: [
    GameVisibility.VISIBLE,
  ],
};

export const PLATFORM_ADMIN_POLICY: GameCreationPolicy = {
  maxPlayers: 20,

  canUseCustomQuestions: true,
  canBranding: true,
  canCreateTournament: true,
  canInviteGuests: true,

  allowedJoinTypes: Object.values(GameJoinType),

  allowedGamePvTypes: Object.values(GamePvType),

  allowedVisibilities: Object.values(GameVisibility),
};
