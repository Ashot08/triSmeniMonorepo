import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtRequest } from '@/modules/auth/interfaces/jwt.request.interface';
import { OrganizationMembershipService } from '../organization-membership.service';

import { ORGANIZATION_ROLES_KEY } from '../decorators/organization-roles.decorator';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membershipService: OrganizationMembershipService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles =
      this.reflector.getAllAndOverride<OrganizationRoleCode[]>(
        ORGANIZATION_ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles?.length) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<JwtRequest>();

    const { id: userId } = request.user;

    const organizationId =
      request.params.organizationId;

    if (!organizationId) {
      throw new BadRequestException('Organization id is required');
    }

    if (typeof organizationId !== 'string') {
      throw new BadRequestException('Invalid organization id');
    }

    const hasRole =
      await this.membershipService.hasAnyRole(
        userId,
        organizationId,
        requiredRoles,
      );

    if (!hasRole) {
      throw new ForbiddenException();
    }

    return true;
  }
}
