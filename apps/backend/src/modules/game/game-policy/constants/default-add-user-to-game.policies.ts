import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';
import { AddUserToGamePolicy } from '@/modules/game/game-policy/interfaces/add-user-to-game-policy.interface';

export const PLATFORM_ADMIN_POLICY: AddUserToGamePolicy = {
  allowedJoinTypes: [GameJoinType.ONLY_ADD_BY_CREATOR, GameJoinType.JOINABLE, GameJoinType.JOIN_WITH_CODE],
}

export const ORGANIZATION_ADMIN_POLICY: AddUserToGamePolicy = {
  allowedJoinTypes: [GameJoinType.ONLY_ADD_BY_CREATOR, GameJoinType.JOINABLE, GameJoinType.JOIN_WITH_CODE],
}

export const SUBSCRIPTION_OWNER_POLICY: AddUserToGamePolicy = {
  allowedJoinTypes: [GameJoinType.ONLY_ADD_BY_CREATOR],
}
