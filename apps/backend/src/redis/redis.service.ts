import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/common/constants/injection-tokens';
import { Session } from '@/modules/auth/interfaces/session.interface';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  ping(): Promise<string> {
    return this.redis.ping();
  }

  set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<'OK'> {
    if (ttlSeconds) {
      return this.redis.set(key, value, 'EX', ttlSeconds);
    }
    return this.redis.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  delete(
    key: string,
  ): Promise<number> {
    return this.redis.del(key);
  }

  sAdd(key: string, ...members: string[]) {
    return this.redis.sadd(key, ...members);
  }

  sRem(key: string, ...members: string[]) {
    return this.redis.srem(key, ...members);
  }

  sMembers(key: string) {
    return this.redis.smembers(key);
  }

  // todo: по идее Redis service не должен знать о существовании сессии,
  //  методы, связанные с сессиями нужно вынести отсюда в репозиторий redis-session
  //  в модуле auth

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

  async getSession(
    sessionId: string,
  ): Promise<Session | null> {
    const key = this.getSessionKey(sessionId);

    const session = await this.redis.hgetall(key);

    if (!session.userId || !session.refreshHash) {
      return null;
    }

    return {
      userId: session.userId,
      refreshHash: session.refreshHash,
      createdAt: session.createdAt,
    };
  }

  async updateSessionRefreshHash(
    sessionId: string,
    refreshHash: string,
  ): Promise<void> {
    const key = this.getSessionKey(sessionId);

    await this.redis.hset(key, {
      refreshHash,
    });
  }

  async deleteSession(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const sessionKey = this.getSessionKey(sessionId);
    const userSessionsKey = this.getUserSessionsKey(userId);

    await this.redis
      .multi()
      .del(sessionKey)
      .srem(userSessionsKey, sessionId)
      .exec();
  }

  async getUserSessions(
    userId: string,
  ): Promise<string[]> {
    return this.redis.smembers(
      this.getUserSessionsKey(userId),
    );
  }

  async deleteSessions(
    userId: string,
    sessionIds: string[],
  ): Promise<void> {

    const pipeline = this.redis.multi();

    for (const sessionId of sessionIds) {
      pipeline.del(
        this.getSessionKey(sessionId),
      );
    }

    pipeline.del(
      this.getUserSessionsKey(userId),
    );

    await pipeline.exec();
  }
}
