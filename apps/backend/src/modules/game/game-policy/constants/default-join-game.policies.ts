import { GameJoinTypePolicy } from '../interfaces/join-game-policy.interface';
import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';

export const PLAYER_POLICY: GameJoinTypePolicy = {
  allowedJoinTypes: [GameJoinType.JOINABLE, GameJoinType.JOIN_WITH_CODE],
};
