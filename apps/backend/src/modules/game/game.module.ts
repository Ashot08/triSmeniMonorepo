import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePolicyService } from '@/modules/game/game-policy/game-policy.service';
import { GameValidationService } from '@/modules/game/game-policy/game-validation.service';
import { RedisService } from '@/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService, RedisService],
  exports: [GameService, GamePolicyService, GameValidationService],
})
export class GameModule {}
