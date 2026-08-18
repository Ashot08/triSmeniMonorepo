import { RoleCode } from '@/common/enums/role.enum';

export interface JwtPayload {
  sub: string;
  login: string;
  sid: string;
  roles: RoleCode[];
}
