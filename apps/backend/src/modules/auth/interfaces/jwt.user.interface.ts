import { RoleCode } from '@/common/enums/role.enum';

export interface JwtUser {
  id: string;
  sessionId: string;
  roles: RoleCode[];
}
