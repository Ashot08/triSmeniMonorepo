import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { CreateGameDto } from '@/modules/game/dto/create-game.dto';
import { GameStatus } from '@/modules/game/enums/game-status.enum';
import { GameMode } from '@/modules/game/enums/game-mode.enum';
import { GameVisibility } from '@/modules/game/enums/game-visibility.enum';
import { GameOwnerType } from '@/modules/game/enums/game-owner-type.enum';
import { Game } from '@/modules/game/entities/game.entity';
import { User } from '@/modules/user/entities/user.entity';
import { JwtRequest } from '@/modules/auth/interfaces/jwt.request.interface';

describe('GameController', () => {
  let controller: GameController;
  let gameService: jest.Mocked<GameService>;

  const gameServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: gameServiceMock,
        },
      ],
    }).compile();

    controller = module.get(GameController);
    gameService = module.get(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call gameService.create', async () => {
    const dto: CreateGameDto = {
      name: 'Game 1',
      description: 'Игра для МБОУ СОШ 443',
      status: GameStatus.PENDING,
      gameMode: GameMode.PVB,
      playersCount: 2,
    };

    const req = {
      user: {id: 'user-1', sessionId: 'session-1', roles: []}
    };

    const game: Game = {
      id: 'game-1',
      name: 'Game 1',
      status: GameStatus.PENDING,
      visibility: GameVisibility.PUBLIC,
      gameMode: GameMode.PVB,
      ownerType: GameOwnerType.PLATFORM,
      playersCount: 2,
      participantCount: 0,
      rounds: 3,
      currentRound: 1,
      startingCoins: 10,
      workersPerPlayer: 6,
      answerTimeoutSeconds: 25,
      isRecorded: true,
      createdAt: new Date('28-09-2006'),
      updatedAt: new Date('28-09-2006'),
      createdBy: {id: 'user-1'} as User,
    };

    jest
      .spyOn(gameService, 'create')
      .mockResolvedValue(game);

    expect(await controller.create(dto, req as unknown as JwtRequest)).toEqual(game);

    expect(gameService.create).toHaveBeenCalledWith({dto, user: req.user});
  });
});
