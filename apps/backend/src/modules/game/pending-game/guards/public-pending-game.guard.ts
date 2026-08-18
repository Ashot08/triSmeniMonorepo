import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PendingGameRepository } from '../pending-game.repository';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';
import { Request } from 'express';
import { PendingGame } from '@/modules/game/pending-game/pending-game';

interface PublicPendingGameRequest extends Request {
  params: {
    id: string;
  };
  game: PendingGame | null;
}

@Injectable()
export class PublicPendingGameGuard implements CanActivate {
  constructor(private readonly pendingGameRepository: PendingGameRepository) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<PublicPendingGameRequest>();

    const game = await this.pendingGameRepository.findPublicById(req.params.id);

    if (!game) {
      throw new PendingGameNotFoundError();
    }

    req.game = game;

    return true;
  }
}
