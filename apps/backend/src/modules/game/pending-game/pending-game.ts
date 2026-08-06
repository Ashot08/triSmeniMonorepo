import { randomUUID } from 'crypto';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GamePvType } from '@/modules/game/enums/game-pv-type.enum';
import { GameJoinType } from '@/modules/game/enums/game-join-type.enum';
import { GameQuestionsType } from '@/modules/game/enums/game-questions-type.enum';

// todo: решить потенциальную проблему concurrency
// например, с помощью version

export enum PendingGameStatus {
  WAITING = 'waiting',
  READY = 'ready',
}

export interface PendingGamePlayer {
  id: string;
  joinedAt: Date;
}


export interface CreatePendingGameParams {
  ownerId: string;
  organizationId: string | undefined;
  settings: PendingGameSettings;
}

export interface PendingGameSettings {
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
  questionsType: GameQuestionsType;
}

export class PendingGame {
  readonly version: number;
  readonly id: string;
  readonly ownerId: string;
  readonly organizationId: string | undefined;
  readonly settings: PendingGameSettings;

  private status: PendingGameStatus;
  private readonly players: PendingGamePlayer[];

  constructor(
    id: string,
    ownerId: string,
    organizationId: string | undefined,
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

  canStart(): boolean {
    return (
      this.players.length === this.settings.playersCount
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

  isPublic(): boolean {
    return this.settings.visibility === GameVisibility.VISIBLE;
  }
  isPvP(): boolean {
    return this.settings.gamePvType === GamePvType.PVP;
  }

}
