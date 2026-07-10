import { applyDecorators, UseGuards } from '@nestjs/common';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { OrganizationRoles } from './organization-roles.decorator';
import { OrganizationRolesGuard } from '@/modules/organization/guards/organization-roles.guard';

export function RequireOrganizationRoles(
  ...roles: OrganizationRoleCode[]
) {
  return applyDecorators(
    OrganizationRoles(...roles),
    UseGuards(OrganizationRolesGuard),
  );
}
