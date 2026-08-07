import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PendingGameRepository } from './pending-game.repository';
import { PendingGame } from './pending-game';
import { RedisService } from '@/redis/redis.service';
import { PendingGameMapper } from './pending-game.mapper';

@Injectable()
export class RedisPendingGameRepository extends PendingGameRepository {
  constructor(
    private readonly redis: RedisService,
  ) {
    super();
  }

  async findById(id: string): Promise<PendingGame | null> {
    const json = await this.redis.get(this.gameKey(id));

    if (!json) {
      return null;
    }

    return PendingGameMapper.fromRedis(json);
  }

  async findPublicById(gameId: string): Promise<PendingGame | null> {
    const game = await this.findById(gameId);

    if (!game) {
      return null;
    }

    if (game.organizationId) {
      return null;
    }

    return game;
  }

  async findOrganizationGameById(
    organizationId: string,
    gameId: string,
  ): Promise<PendingGame | null> {
    const game = await this.findById(gameId);

    if (!game) {
      return null;
    }

    if (game.organizationId !== organizationId) {
      return null;
    }

    return game;
  }

  async findByOwner(ownerId: string): Promise<PendingGame[]> {
    const ids = await this.redis.sMembers(this.ownerKey(ownerId));

    return this.loadGames(ids);
  }

  async findByOrganization(
    organizationId: string,
  ): Promise<PendingGame[]> {
    const ids = await this.redis.sMembers(
      this.organizationKey(organizationId),
    );

    return this.loadGames(ids);
  }

  async findPublic(): Promise<PendingGame[]> {
    const ids = await this.redis.sMembers(
      this.publicGamesKey(),
    );

    return this.loadGames(ids);
  }

  async create(game: PendingGame): Promise<void> {
    const redis = this.redis.client();
    const gameKey = this.gameKey(game.id);

    const existing = await redis.get(gameKey);

    if (existing) {
      throw new ConflictException(
        'Pending game already exists.',
      );
    }

    const dto = PendingGameMapper.toRedis(game);

    const tx = redis.multi()

    tx.set(gameKey, JSON.stringify(dto), 'EX', 60 * 300, );

    tx.sadd(this.ownerKey(game.ownerId), game.id);

    if (game.organizationId) {
      tx.sadd(this.organizationKey(game.organizationId), game.id,);
    }

    if (game.isPublic()) {
      tx.sadd(this.publicGamesKey(), game.id,);
    }

    if (game.isPvP()) {
      tx.sadd(this.pVpGamesKey(), game.id,);
    }

    await tx.exec();
  }

  async update(game: PendingGame): Promise<void> {
    const redis = this.redis.client();
    const gameKey = this.gameKey(game.id);

    await redis.watch(gameKey);

    try {
      const json = await redis.get(gameKey);

      const stored = json ? PendingGameMapper.fromRedis(json) : null;

      if (!stored) {
        throw new NotFoundException(
          'Pending game not found.',
        );
      }

      if (
        stored &&
        stored.getVersion() !== game.getVersion()
      ) {
        throw new ConflictException('Pending game was modified by another request.');
      }

      const nextVersion = game.getVersion() + 1;

      const dto = PendingGameMapper.toRedis(game, nextVersion);

      const tx = redis.multi()

      tx.set(gameKey, JSON.stringify(dto), 'EX', 60*300);

      const result = await tx.exec();

      if (result === null) {
        throw new ConflictException(
          'The game was modified by another request.',
        );
      }

      game.commitVersion(nextVersion);
    } finally {
      await redis.unwatch();
    }
  }

  async remove(id: string): Promise<void> {
    const game = await this.findById(id);

    if (!game) {
      return;
    }

    const redis = this.redis.client();

    const tx = redis.multi()

    tx.del(this.gameKey(id));

    tx.srem(this.ownerKey(game.ownerId), game.id,);

    if (game.organizationId) {
      tx.srem(this.organizationKey(game.organizationId), game.id,);
    }

    if (game.isPublic()) {
      tx.srem(this.publicGamesKey(), game.id,);
    }

    if (game.isPvP()) {
      tx.srem(this.pVpGamesKey(), game.id,);
    }
  }

  // ---------------------------------------------------------

  private async loadGames(
    ids: string[],
  ): Promise<PendingGame[]> {
    const games = await Promise.all(
      ids.map(id => this.findById(id)),
    );

    return games.filter(
      (game): game is PendingGame => game !== null,
    );
  }


  // ---------------------------------------------------------

  private gameKey(id: string): string {
    return `pending-game:${id}`;
  }

  private ownerKey(ownerId: string): string {
    return `pending-game:owner:${ownerId}`;
  }

  private organizationKey(
    organizationId: string,
  ): string {
    return `pending-game:organization:${organizationId}`;
  }

  private publicGamesKey(): string {
    return 'pending-game:public';
  }

  private pVpGamesKey(): string {
    return 'pending-game:pvp';
  }
}
