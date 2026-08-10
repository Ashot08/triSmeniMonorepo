import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PendingGameRepository } from '../pending-game.repository';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';

@Injectable()
export class PublicPendingGameGuard implements CanActivate {
  constructor(
    private readonly pendingGameRepository: PendingGameRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const game = await this.pendingGameRepository.findPublicById(
      req.params.gameId,
    );

    if (!game) {
      throw new PendingGameNotFoundError();
    }

    req.game = game;

    return true;
  }
}
