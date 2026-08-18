import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { CreatePendingGameUseCase } from '../application/create-pending-game.use-case';
import { JoinGameUseCase } from '../application/join-game.use-case';
import { PublicPendingGameGuard } from './guards/public-pending-game.guard';
import { JoinGameDto } from '../dto/join-game.dto';
import { AddUserToGameDto } from '../dto/add-user-to-game.dto';
import { AddUserToGameUseCase } from '../application/add-user-to-game.use-case';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { PendingGameService } from './pending-game.service';
import { RequireGlobalRoles } from '@/modules/auth/decorators/require-global-roles.decorator';
import { RoleCode } from '@/common/enums/role.enum';

@ApiBearerAuth()
@Controller('pending-game')
export class PendingGameController {
  constructor(
    private readonly createPendingGameUseCase: CreatePendingGameUseCase,
    private readonly joinGameUseCase: JoinGameUseCase,
    private readonly addUserToGameUseCase: AddUserToGameUseCase,
    private readonly pendingGameService: PendingGameService,
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

    @CurrentUser() user: JwtUser,
  ) {
    return this.createPendingGameUseCase.execute({ dto, user });
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
    // type: JoinPendingGameResponseDto,
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

    @CurrentUser() user: JwtUser,
  ) {
    return this.joinGameUseCase.execute({ id, dto, user });
  }

  @UseGuards(PublicPendingGameGuard)
  @Post('/:id/add')
  @ApiOperation({
    summary: 'Add player to pending game (by another user)',
  })
  @ApiBody({
    type: AddUserToGameDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Game UUID',
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
  })
  @ApiResponse({
    status: 200,
    description: 'Add to game success.',
    // type: AddPendingGameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pending game not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Player already joined',
  })
  addUserToGame(
    @Param('id') id: string,

    @Body() dto: AddUserToGameDto,

    @CurrentUser() user: JwtUser,
  ) {
    return this.addUserToGameUseCase.execute({ id, dto, user });
  }

  // todo вынести в use-case и сделать единый эндпоинт и для админа и для юзера,
  //  а юз кейс будет определять что выдать в зависимости от policy
  @RequireGlobalRoles(RoleCode.PLATFORM_ADMIN)
  @Get('/:id')
  @ApiOperation({
    summary: 'Get pending game by UUID (only platform admin)',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Game UUID',
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
  })
  @ApiResponse({
    status: 200,
    description: 'Get pending game success.',
    // type: AddPendingGameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pending game not found',
  })
  findOne(@Param('id') id: string) {
    return this.pendingGameService.findOne(id);
  }
}
