import { PendingGame } from './pending-game';

export abstract class  PendingGameRepository {
  abstract findById(id: string): Promise<PendingGame | null>;

  abstract findPublicById(gameId: string): Promise<PendingGame | null>;

  abstract findOrganizationGameById(
    organizationId: string,
    gameId: string,
  ): Promise<PendingGame | null>;

  abstract findPublic(): Promise<PendingGame[]>;

  abstract findByOwner(ownerId: string): Promise<PendingGame[]>;

  abstract findByOrganization(organizationId: string): Promise<PendingGame[]>;

  abstract create(game: PendingGame): Promise<void>;

  abstract update(game: PendingGame): Promise<void>;

  abstract remove(id: string): Promise<void>;
}
