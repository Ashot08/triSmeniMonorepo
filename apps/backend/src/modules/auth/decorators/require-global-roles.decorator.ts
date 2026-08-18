import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleCode } from '@/common/enums/role.enum';
import { GlobalRoles } from './roles.decorator';
import { GlobalRolesGuard } from '../guards/roles.guard';

export function RequireGlobalRoles(...roles: RoleCode[]) {
  return applyDecorators(GlobalRoles(...roles), UseGuards(GlobalRolesGuard));
}
