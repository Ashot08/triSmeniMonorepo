import { randomUUID } from 'crypto';
import { GameStatus } from '@/modules/game/enums/game-status.enum';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GameOwnerType } from '@/modules/game/enums/game-owner-type.enum';
import { GamePvType } from '@/modules/game/enums/game-pv-type.enum';
import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';

export enum PendingGameStatus {
  WAITING = 'waiting',
  READY = 'ready',
}

export interface PendingGamePlayer {
  id: string;
  ready: boolean;
  joinedAt: Date;
}


interface CreatePendingGameParams {
  ownerId: string;
  organizationId: string | null;
  settings: PendingGameSettings;
}

interface PendingGameSettings {
  name: string;
  description?: string;
  // status: GameStatus;
  visibility: GameVisibility;
  joinType: GameJoinType;
  gamePvType: GamePvType;
  // ownerType: GameOwnerType;
  playersCount: number;
  shiftsCount: number;
  startingCoins: number;
  workersPerPlayer: number;
  // scheduledStartAt: Date;
  inviteCode?: string; // Код для присоединения (если PRIVATE)
  // questionCategoryId?: QuestionCat[]; // какие категории вопросов использовть,
  answerTimeoutSeconds: number;
  isRecordedToStatistics: boolean;
}

export class PendingGame {
  readonly id: string;
  readonly ownerId: string;
  readonly organizationId: string | null;
  readonly settings: PendingGameSettings;

  private status: PendingGameStatus;
  private readonly players: PendingGamePlayer[];

  private constructor(
    id: string,
    ownerId: string,
    organizationId: string | null,
    status: PendingGameStatus,
    settings: PendingGameSettings,
    players: PendingGamePlayer[],
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.organizationId = organizationId;
    this.status = status;
    this.settings = settings;
    this.players = players;

  }

  static create(params: CreatePendingGameParams): PendingGame {
    return new PendingGame(
      randomUUID(),
      params.ownerId,
      params.organizationId,
      PendingGameStatus.WAITING,
      params.settings,
      [
        {
          id: params.ownerId,
          ready: false,
          joinedAt: new Date(),
        },
      ],
    );
  }

  join(playerId: string): void {
    if (this.status !== PendingGameStatus.WAITING) {
      throw new Error('Game is not accepting players');
    }

    if (this.players.some(player => player.id === playerId)) {
      throw new Error('Player already joined');
    }

    if (this.players.length >= this.settings.playersCount) {
      throw new Error('Game is full');
    }

    this.players.push({
      id: playerId,
      ready: false,
      joinedAt: new Date(),
    });
  }

  leave(playerId: string): void {
    const index = this.players.findIndex(
      player => player.id === playerId,
    );

    if (index === -1) {
      throw new Error('Player not found');
    }

    this.players.splice(index, 1);
  }

  ready(playerId: string): void {
    const player = this.players.find(
      player => player.id === playerId,
    );

    if (!player) {
      throw new Error('Player not found');
    }

    player.ready = true;

    if (this.canStart()) {
      this.status = PendingGameStatus.READY;
    }
  }

  unready(playerId: string): void {
    const player = this.players.find(
      player => player.id === playerId,
    );

    if (!player) {
      throw new Error('Player not found');
    }

    player.ready = false;
    this.status = PendingGameStatus.WAITING;
  }

  canStart(): boolean {
    return (
      this.players.length === this.settings.playersCount &&
      this.players.every(player => player.ready)
    );
  }

  getPlayers(): readonly PendingGamePlayer[] {
    return this.players;
  }

  getStatus(): PendingGameStatus {
    return this.status;
  }

  getSettings(): Readonly<PendingGameSettings> {
    return this.settings;
  }
}
