import { Controller, Get, Post, Body, Param, UseGuards, ConflictException } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { CreatePendingGameUseCase } from '../application/create-pending-game.use-case';
import { JoinGameUseCase } from '../application/join-game.use-case';
import { PublicPendingGameGuard } from './guards/public-pending-game.guard';

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

  @UseGuards(PublicPendingGameGuard)
  @Post('/:id/join')
  join(
    @Param('id') id: string,

    @Body() dto: CreateGameDto,

    @CurrentUser() user: JwtUser
  ) {
    return this.joinGameUseCase.execute({id, dto, user});
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
