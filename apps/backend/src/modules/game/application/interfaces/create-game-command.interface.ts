import { CreateGameDto } from '../../dto/create-game.dto';
import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';

export interface CreateGameCommand {
  dto: CreateGameDto;
  organizationId?: string;
  user: JwtUser;
}
