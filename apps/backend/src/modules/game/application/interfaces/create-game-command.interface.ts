import { CreateGameDto } from '../../dto/create-game.dto';
import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';

export interface CreateGameCommand {
  dto: CreateGameDto;
  organizationId?: string;
  organizationRoles?: OrganizationRoleCode[];
  user: JwtUser;
}
