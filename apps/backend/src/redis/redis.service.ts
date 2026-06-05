import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/common/constants/injection-tokens';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async ping(): Promise<string> {
    return this.redis.ping();
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
      return;
    }

    await this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  private getJwtRefreshKey(userId: string): string {
    return `auth:refresh:${userId}`;
  }

  async setJwtRefreshToken(userId: string, token: string, ttl: number) {
    const key = this.getJwtRefreshKey(userId);
    await this.set(key, token, ttl);
  }
}
