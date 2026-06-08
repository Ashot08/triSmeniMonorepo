import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/common/constants/injection-tokens';
import { Session } from '@/modules/auth/interfaces/session.interface';
import * as bcrypt from 'bcrypt';

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

  private getSessionKey(sessionId: string): string {
    return `auth:session:${sessionId}`;
  }

  private getUserSessionsKey(userId: string): string {
    return `auth:user:${userId}:sessions`;
  }

  async createSession(
    sessionId: string,
    userId: string,
    refreshHash: string,
    ttlSeconds: number,
  ): Promise<void> {
    const sessionKey = this.getSessionKey(sessionId);
    const userSessionsKey = this.getUserSessionsKey(userId);

    const session: Session = {
      userId,
      refreshHash,
      createdAt: new Date().toISOString(),
    };

    await this.redis
      .multi()
      .hset(
        sessionKey,
        session
      )
      .expire(sessionKey, ttlSeconds)
      .sadd(userSessionsKey, sessionId)
      .exec();
  }

  async getSession(...)

  async updateSessionRefreshHash(...)

  async deleteSession(...)

}
