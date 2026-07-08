import { RoleCode } from '@/common/enums/role.enum';

export interface LoginUser {
  id: string;
  email: string | null;
  username: string;
  roles: RoleCode[];
}
