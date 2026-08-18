import { SetMetadata } from '@nestjs/common';
import { RoleCode } from '@/common/enums/role.enum';

export const GLOBAL_ROLES_KEY = 'global_roles';

export const GlobalRoles = (...roles: RoleCode[]) =>
  SetMetadata(GLOBAL_ROLES_KEY, roles);
