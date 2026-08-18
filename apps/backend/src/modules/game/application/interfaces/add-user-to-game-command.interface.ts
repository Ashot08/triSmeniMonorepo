import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { AddUserToGameDto } from '@/modules/game/dto/add-user-to-game.dto';

export interface AddUserToGameCommand {
  id: string;
  dto: AddUserToGameDto;
  user: JwtUser;
  organizationId?: string;
  organizationRoles?: OrganizationRoleCode[];
}
