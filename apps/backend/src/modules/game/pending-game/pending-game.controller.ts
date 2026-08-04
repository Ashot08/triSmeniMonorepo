import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { CreatePendingGameUseCase } from '../application/create-pending-game.use-case';
import { JoinGameUseCase } from '../application/join-game.use-case';

@Controller('pending-game')
export class PendingGameController {
  constructor(
    private readonly createPendingGameUseCase: CreatePendingGameUseCase,
    private readonly joinGameUseCase: JoinGameUseCase,
  ) {}

  @Post()
  create(
    @Body() dto: CreateGameDto,

    @CurrentUser() user: JwtUser
  ) {
    return this.createPendingGameUseCase.execute({dto, user});
  }

  @Get('/:id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.joinGameUseCase.execute({
      id,
      dto: {},
      user,
    })
  }
}
