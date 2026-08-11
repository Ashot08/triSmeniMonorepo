import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';

export interface AddUserToGamePolicy {
  allowedJoinTypes: GameJoinType[];
}
