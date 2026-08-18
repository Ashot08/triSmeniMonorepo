import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GameIsFullError } from '@/modules/game/pending-game/errors/game-is-full.error';
import { PlayerAlreadyJoinedError } from '@/modules/game/pending-game/errors/player-already-joined.error';
import { GameNotAcceptingPlayersError } from '@/modules/game/pending-game/errors/game-not-accepting-players.error';
import { PendingGameNotFoundError } from '@/modules/game/pending-game/errors/pending-game-not-found.error';
import { Response } from 'express';

@Catch(
  GameIsFullError,
  PlayerAlreadyJoinedError,
  GameNotAcceptingPlayersError,
  PendingGameNotFoundError,
)
export class PendingGameExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof PendingGameNotFoundError) {
      response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
      return;
    }

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
