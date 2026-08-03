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

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    RedisModule
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GamePolicyService,
    GameValidationService,
    {
      provide: PendingGameRepository,
      useClass: RedisPendingGameRepository
    }
  ],
  exports: [GameService, GamePolicyService, GameValidationService],
})
export class GameModule {}
