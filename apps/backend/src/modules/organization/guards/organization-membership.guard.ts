import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OrganizationMembershipService } from '@/modules/organization/organization-membership.service';
import { Request } from 'express';

interface OrganizationMembershipRequest extends Request {
  params: {
    organizationId: string;
  };
  body: {
    userId: string;
  };
}

@Injectable()
export class OrganizationMembershipGuard implements CanActivate {
  constructor(
    private readonly membershipService: OrganizationMembershipService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<OrganizationMembershipRequest>();

    const organizationId = req.params.organizationId;
    const userId = req.body.userId;

    const isMember = await this.membershipService.isMember(
      userId,
      organizationId,
    );

    if (!isMember) {
      throw new ForbiddenException('User is not member of this organization');
    }

    return true;
  }
}
