import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { User } from '@/modules/user/entities/user.entity';
import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';

interface CreateGameOptions {
  dto: CreateGameDto;
  organizationId?: string;
  user: JwtUser;
}

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly gamePolicyService: GamePolicyService,
    private readonly gameValidationService: GameValidationService,
  ) {}

  async create({
                 dto,
                 organizationId,
                 user,
               }: CreateGameOptions): Promise<Game> {
    const policy = this.gamePolicyService.getPolicy({user, organizationId});
    this.gameValidationService.validate(dto, policy);

    const game = this.gameRepository.create({
      ...dto,
      organization: organizationId ? ({ id: organizationId } as Organization) : undefined,
      createdBy: {id: user.id} as User,
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
