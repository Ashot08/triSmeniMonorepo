import { Inject, Injectable } from '@nestjs/common';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';

@Injectable()
export class PendingGameService {
  constructor(
    @Inject(PendingGameRepository)
    private readonly pendingGameRepository: PendingGameRepository,
  ) {}
  findAll() {
    return `This action returns all game`;
  }

  async findOne(id: string) {
    const game = await this.pendingGameRepository.findById(id);
    if (!game) {
      throw new PendingGameNotFoundError();
    }
    return game;
  }
}
