import { Injectable } from '@nestjs/common';
import { PendingGameRepository } from './pending-game.repository';
import { PendingGame } from './pending-game';
import { RedisService } from '@/redis/redis.service';

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
    const data = JSON.parse(json);

    return new PendingGame(
      data.id,
      data.ownerId,
      data.organizationId,
      data.status,
      data.settings,
      data.players,
    );
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

  async save(game: PendingGame): Promise<void> {
    const redis = this.redis.client();
    const gameKey = this.gameKey(game.id);

    // todo: добавить проверку и обновление версии
    // с помощью redis.watch
    //


    const stored = await this.findById(gameKey);
    // Если игры нет — значит это первое сохранение
    if (stored) {
      if (stored.version !== game.version) {
        throw new ConcurrencyException();
      }
      stored.version += 1;
    }



    await redis.watch(gameKey);

    try {
      const tx = redis.multi()

      tx.set(gameKey, JSON.stringify(game), 'EX', 60*300);

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

      // todo: всё таки нужно сохранить персистентность версии
      // поэтому, несмотря на то, что в большинстве кейсов агрегат
      // заканчивает свой жизненный цикл после метода save,
      // всё равно нужно обновить его версию, на всякий случай.
      // game.updateVersion(nextVersion);

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
