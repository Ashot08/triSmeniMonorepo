import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { Request } from 'express';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';

export interface OrganizationContext {
  roles: OrganizationRoleCode[];
}

export interface JwtRequest extends Request {
  user: JwtUser;
  organizationContext?: OrganizationContext;
}
