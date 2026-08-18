import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';
import { PendingGame } from '@/modules/game/pending-game/pending-game';
import { Request } from 'express';

interface OrganizationPendingGameRequest extends Request {
  params: {
    organizationId: string;
    gameId: string;
  };
  game: PendingGame | null;
}

@Injectable()
export class OrganizationPendingGameGuard implements CanActivate {
  constructor(private readonly pendingGameRepository: PendingGameRepository) {}

  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<OrganizationPendingGameRequest>();

    const game = await this.pendingGameRepository.findOrganizationGameById(
      req.params.organizationId,
      req.params.gameId,
    );

    if (!game) {
      throw new PendingGameNotFoundError();
    }

    req.game = game;

    return true;
  }
}
