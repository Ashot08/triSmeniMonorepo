import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { User } from '@/modules/user/entities/user.entity';

interface CreateGameOptions {
  dto: CreateGameDto;
  organizationId?: string;
  createdBy: string;
}

@Injectable()
export class GameService {
  constructor(@InjectRepository(Game) private readonly gameRepository: Repository<Game>,) {
  }

  async create({
                 dto,
                 organizationId,
                 createdBy,
               }: CreateGameOptions): Promise<Game> {
    const game = this.gameRepository.create({
      ...dto,
      organization: {id: organizationId} as Organization,
      createdBy: {id: createdBy} as User,
    });

    return this.gameRepository.save(game);
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
