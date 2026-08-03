import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GamePvType } from '@/modules/game/enums/game-pv-type.enum';

export interface GameCreationPolicy {
  maxPlayers: number;

  canUseCustomQuestions: boolean;
  canBranding: boolean;
  canCreateTournament: boolean;
  canInviteGuests: boolean;


  allowedGamePvTypes: GamePvType[];
  allowedVisibilities: GameVisibility[];
  allowedJoinTypes: GameJoinType[];
}
