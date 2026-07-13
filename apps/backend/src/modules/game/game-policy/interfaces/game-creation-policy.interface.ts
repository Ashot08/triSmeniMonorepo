import { GameMode } from '@/modules/game/enums/game-mode.enum';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';

export interface GameCreationPolicy {
  maxPlayers: number;

  canUseCustomQuestions: boolean;
  canBranding: boolean;
  canCreateTournament: boolean;
  canInviteGuests: boolean;

  allowedGameModes: GameMode[];
  allowedVisibilities: GameVisibility[];
}
