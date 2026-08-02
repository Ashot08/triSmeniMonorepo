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
    // todo: переделать
    return Object.assign(
      Object.create(PendingGame.prototype),
      JSON.parse(json),
    );
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
    await this.redis.set(
      this.gameKey(game.id),
      JSON.stringify(game),
      60 * 300,
      // todo по идее редис не должен удалять игру по TTL
      // это нужно делать в отдельном юз-кейсе или сервисе
      // так как при удалении игры нужно вызывать соотв. событие
      // и удалять связанные с ней индексы/фильтры из редиса
      // иначе там будет копиться мусор.
      // так что TTL тут не совсем уместно.
    );

    await this.index(game);
  }

  async remove(id: string): Promise<void> {
    const game = await this.findById(id);

    if (!game) {
      return;
    }

    await this.redis.delete(this.gameKey(id));

    await this.unindex(game);
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

  private async index(game: PendingGame): Promise<void> {
    await this.redis.sAdd(
      this.ownerKey(game.ownerId),
      game.id,
    );

    if (game.organizationId) {
      await this.redis.sAdd(
        this.organizationKey(game.organizationId),
        game.id,
      );
    }

    if (game.isPublic()) {
      await this.redis.sAdd(
        this.publicGamesKey(),
        game.id,
      );
    }

    if (game.isPvP()) {
      await this.redis.sAdd(
        this.pVpGamesKey(),
        game.id,
      );
    }
  }

  private async unindex(
    game: PendingGame,
  ): Promise<void> {
    await this.redis.sRem(
      this.ownerKey(game.ownerId),
      game.id,
    );

    if (game.organizationId) {
      await this.redis.sRem(
        this.organizationKey(game.organizationId),
        game.id,
      );
    }

    if (game.isPublic()) {
      await this.redis.sRem(
        this.publicGamesKey(),
        game.id,
      );
    }

    if (game.isPvP()) {
      await this.redis.sRem(
        this.pVpGamesKey(),
        game.id,
      );
    }
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
