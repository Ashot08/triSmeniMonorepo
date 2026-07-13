import {
  ORGANIZATION_POLICY,
  PLATFORM_ADMIN_POLICY, PLAYER_POLICY,
  SUBSCRIPTION_OWNER_POLICY
} from './constants/default-game-policies';
import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { GameCreationPolicy } from '@/modules/game/game-policy/interfaces/game-creation-policy.interface';
import { RoleCode } from '@/common/enums/role.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamePolicyService {
  getPolicy(user: JwtUser): GameCreationPolicy {
    if (user.roles.includes(RoleCode.PLATFORM_ADMIN)) {
      return PLATFORM_ADMIN_POLICY;
    }

    if (user.roles.includes(RoleCode.ORGANIZATION_OWNER)) {
      return ORGANIZATION_POLICY;
    }

    if (user.roles.includes(RoleCode.SUBSCRIPTION_OWNER)) {
      return SUBSCRIPTION_OWNER_POLICY;
    }

    return PLAYER_POLICY;
  }
}
