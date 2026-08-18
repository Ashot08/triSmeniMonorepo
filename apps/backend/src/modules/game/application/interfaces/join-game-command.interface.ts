import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { JoinGameDto } from '@/modules/game/dto/join-game.dto';

export interface JoinGameCommand {
  id: string;
  dto: JoinGameDto;
  organizationId?: string;
  organizationRoles?: OrganizationRoleCode[];
  user: JwtUser;
}
