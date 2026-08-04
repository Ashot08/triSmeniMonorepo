import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateGameDto,

    @CurrentUser() user: JwtUser
  ) {
    return this.gameService.create({dto, createdById: user.id});
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
