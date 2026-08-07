import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';
import { PendingGameRepository } from '@/modules/game/pending-game/pending-game.repository';
import { RedisPendingGameRepository } from '@/modules/game/pending-game/redis-pending-game.repository';
import { RedisModule } from '@/redis/redis.module';
import { CreatePendingGameUseCase } from '@/modules/game/application/create-pending-game.use-case';
import { JoinGameUseCase } from '@/modules/game/application/join-game.use-case';
import { PendingGameController } from '@/modules/game/pending-game/pending-game.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    RedisModule
  ],
  controllers: [GameController, PendingGameController],
  providers: [
    GameService,
    GamePolicyService,
    GameValidationService,
    CreatePendingGameUseCase,
    JoinGameUseCase,
    {
      provide: PendingGameRepository,
      useClass: RedisPendingGameRepository
    }
  ],
  exports: [
    GameService,
    GamePolicyService,
    GameValidationService,
    CreatePendingGameUseCase,
    JoinGameUseCase,
    PendingGameRepository,
  ],
})
export class GameModule {}
