import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { JoinGameDto } from '@/modules/game/dto/join-game.dto';

export interface AddUserToGameCommand {
  id: string;
  dto: JoinGameDto;
  userId: string;
  user: JwtUser;
  organizationId?: string;
  organizationRoles?: OrganizationRoleCode[];
}

