import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { SetMetadata } from '@nestjs/common';

export const ORGANIZATION_ROLES_KEY = 'organization_roles';

export const OrganizationRoles = (...roles: OrganizationRoleCode[]) =>
  SetMetadata(ORGANIZATION_ROLES_KEY, roles);
