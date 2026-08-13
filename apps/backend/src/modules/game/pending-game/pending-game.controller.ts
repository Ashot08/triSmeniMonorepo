import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { CreatePendingGameUseCase } from '../application/create-pending-game.use-case';
import { JoinGameUseCase } from '../application/join-game.use-case';
import { PublicPendingGameGuard } from './guards/public-pending-game.guard';
import { JoinGameDto } from '@/modules/game/dto/join-game.dto';
import { AddUserToGameDto } from '@/modules/game/dto/add-user-to-game.dto';
import { AddUserToGameUseCase } from '@/modules/game/application/add-user-to-game.use-case';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('pending-game')
export class PendingGameController {
  constructor(
    private readonly createPendingGameUseCase: CreatePendingGameUseCase,
    private readonly joinGameUseCase: JoinGameUseCase,
    private readonly addUserToGameUseCase: AddUserToGameUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create pending game',
  })
  @ApiBody({
    type: CreateGameDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Game created successfully.',
    // type: CreatePendingGameResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Create game error',
  })
  create(
    @Body() dto: CreateGameDto,

    @CurrentUser() user: JwtUser
  ) {
    return this.createPendingGameUseCase.execute({dto, user});
  }

  @UseGuards(PublicPendingGameGuard)
  @Post('/:id/join')
  @ApiOperation({
    summary: 'Join to pending game as simple player',
  })
  @ApiBody({
    type: JoinGameDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Game UUID',
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
  })
  @ApiResponse({
    status: 200,
    description: 'Join game success.',
    // type: CreatePendingGameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pending game not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Player already joined',
  })
  join(
    @Param('id') id: string,

    @Body() dto: JoinGameDto,

    @CurrentUser() user: JwtUser
  ) {
    return this.joinGameUseCase.execute({id, dto, user});
  }

  @UseGuards(PublicPendingGameGuard)
  @Post('/:id/add')
  addUserToGame(
    @Param('id') id: string,

    @Body() dto: AddUserToGameDto,

    @CurrentUser() user: JwtUser
  ) {
    return this.addUserToGameUseCase.execute({id, dto, user});
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
