import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';

@Injectable()
export class OrganizationPendingGameGuard implements CanActivate {
  constructor(
    private readonly pendingGameRepository: PendingGameRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const game = await this.pendingGameRepository.findOrganizationGameById(
      req.params.organizationId,
      req.params.gameId,
    );

    if (!game) {
      throw new NotFoundException();
    }

    req.game = game;

    return true;
  }
}
