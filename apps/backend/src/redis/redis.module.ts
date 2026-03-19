import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { EnvVariable } from '@/config/env.enum';
import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { REDIS_CLIENT } from '@/common/constants/injection-tokens';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.get(EnvVariable.REDIS_HOST),
          port: config.get<number>(EnvVariable.REDIS_PORT),
          password: config.get(EnvVariable.REDIS_PASSWORD),
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  controllers: [RedisController],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
