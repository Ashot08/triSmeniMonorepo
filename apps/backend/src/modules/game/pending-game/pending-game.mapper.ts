import { PendingGame, PendingGamePlayer, PendingGameSettings, PendingGameStatus } from './pending-game';

export interface PendingGamePlayerRedisDto {
  id: string;
  joinedAt: string;
}

export interface PendingGameRedisDto {
  id: string;
  ownerId: string;
  organizationId?: string;
  version: number;
  status: PendingGameStatus;
  settings: PendingGameSettings;
  players: PendingGamePlayerRedisDto[];
}

export class PendingGameMapper {
  static toRedis(
    game: PendingGame,
    version = game.getVersion(),
  ): PendingGameRedisDto {
    return {
      id: game.id,
      ownerId: game.ownerId,
      organizationId: game.organizationId,
      version,
      status: game.getStatus(),
      settings: game.getSettings(),
      players: game.getPlayers().map(player => ({
        ...player,
        joinedAt: player.joinedAt.toISOString(),
      })),
    };
  }

  static fromRedis(json: string): PendingGame {
    const dto = JSON.parse(json) as PendingGameRedisDto;

    return new PendingGame(
      dto.version,
      dto.id,
      dto.ownerId,
      dto.organizationId,
      dto.status,
      dto.settings,
      dto.players.map(player => ({
        ...player,
        joinedAt: new Date(player.joinedAt),
      })),
    );
  }
}
