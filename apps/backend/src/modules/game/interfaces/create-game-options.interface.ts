import { CreateGameDto } from '../dto/create-game.dto';

export interface CreateGameOptions {
  dto: CreateGameDto;
  organizationId?: string;
  createdById: string;
}
