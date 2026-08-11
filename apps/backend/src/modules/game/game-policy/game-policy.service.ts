import {
  ORGANIZATION_ADMIN_POLICY, ORGANIZATION_PLAYER_POLICY,
  PLATFORM_ADMIN_POLICY, PLAYER_POLICY,
  SUBSCRIPTION_OWNER_POLICY
} from './constants/default-game-creation.policies';
import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { GameCreationPolicy } from '@/modules/game/game-policy/interfaces/game-creation-policy.interface';
import { RoleCode } from '@/common/enums/role.enum';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';

interface GameCreationContext {
  user: JwtUser;
  organizationId?: string;
  organizationRoles?: OrganizationRoleCode[];
}

interface AddUserToGameContext {
  user: JwtUser;
  organizationId?: string;
  organizationRoles?: OrganizationRoleCode[];
}

@Injectable()
export class GamePolicyService {
  getCreateGamePolicy(context: GameCreationContext): GameCreationPolicy {
    if (context.user.roles.includes(RoleCode.PLATFORM_ADMIN)) {
      return PLATFORM_ADMIN_POLICY;
    }

    if (context.organizationRoles?.includes(
        OrganizationRoleCode.ORGANIZATION_ADMIN,
      )
    ) {
      return ORGANIZATION_ADMIN_POLICY;
    }

    if (context.organizationRoles?.includes(
        OrganizationRoleCode.PLAYER,
      )
    ) {
      return ORGANIZATION_PLAYER_POLICY;
    }

    if (context.user.roles.includes(RoleCode.SUBSCRIPTION_OWNER)) {
      return SUBSCRIPTION_OWNER_POLICY;
    }

    return PLAYER_POLICY;
  }

  getJoinGamePolicy () {
    return PLAYER_POLICY;
  }

  getAddUserToGamePolicy (context: AddUserToGameContext) {
    if (context.user.roles.includes(RoleCode.PLATFORM_ADMIN)) {
      return PLATFORM_ADMIN_POLICY;
    }

    if (context.organizationRoles?.includes(
      OrganizationRoleCode.ORGANIZATION_ADMIN,
    )
    ) {
      return ORGANIZATION_ADMIN_POLICY;
    }

    return SUBSCRIPTION_OWNER_POLICY;
  }

}
